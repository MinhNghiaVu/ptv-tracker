import { logger } from "~/utils/logger";
import type { ProcessedStop, Stop } from "../interfaces/stop.interface";
import { searchStops as ptvSearchStops } from "../services/ptv.service";

// ==============================
// SEARCH CONTROLLER
// ==============================

export async function searchStops(input: { query: string; limit?: number }): Promise<{
  stops: ProcessedStop[];
  totalCount: number;
}> {
  try {
    const limit = input.limit ?? 50; // Provide default if undefined
    
    // Sanitise and validate search query
    const sanitisedQuery = sanitiseSearchQuery(input.query);

    if (sanitisedQuery.length < 2) {
      logger.warn(`[SEARCH_CONTROLLER] Search query too short after sanitisation: "${input.query}"`);
      return {
        stops: [],
        totalCount: 0,
      };
    }

    logger.info(`[SEARCH_CONTROLLER] Processing stop search: "${sanitisedQuery}"`);

    // Call PTV API service to get stops
    const ptvResults = await ptvSearchStops(sanitisedQuery);

    // Process results
    const processedStops = processStopResults(ptvResults.stops, limit);

    // Return formatted results
    const result = {
      stops: processedStops,
      totalCount: ptvResults.totalCount || processedStops.length,
    };

    logger.info(`[SEARCH_CONTROLLER] Search completed: ${processedStops.length} stops found`);
    return result;

  } catch (error) {
    logger.error(`[SEARCH_CONTROLLER] Search stops failed: ${error}`);
    throw error;
  }
}

// ============================================
// PRIVATE HELPER METHODS
// ============================================

function sanitiseSearchQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s\-']/gi, '') // Keep letters, numbers, spaces, hyphens, apostrophes
    .replace(/\s+/g, ' ') // Normalise multiple spaces to single space
    .replace(/^[\s\-]+|[\s\-]+$/g, ''); // Remove leading/trailing spaces and hyphens
}

function processStopResults(stops: Stop[], limit: number): ProcessedStop[] {
  if (!Array.isArray(stops)) {
    logger.warn(`[SEARCH_CONTROLLER] Expected array of stops, got: ${typeof stops}`);
    return [];
  }

  return stops
    .map(stop => {
      // Transform PTV API format to our standard format
      try {
        return {
          id: stop.stop_id, // Already a number from interface
          name: stop.stop_name || 'Unknown Stop',
          suburb: stop.stop_suburb || null,
          routeType: stop.route_type, // Already a number from interface
          latitude: stop.stop_latitude, // Already a number from interface
          longitude: stop.stop_longitude, // Already a number from interface
        };
      } catch (error) {
        logger.warn(`[SEARCH_CONTROLLER] Failed to transform stop ${stop.stop_name}'s data: ${error}`);
        return null;
      }
    })
    .filter((stop): stop is ProcessedStop => {
      // Filter out invalid stops
      return stop !== null && stop.id > 0 && stop.name !== 'Unknown Stop';
    })
    .filter((stop, index, array) => {
      // Remove duplicates based on stop ID
      return array.findIndex(s => s.id === stop.id) === index;
    })
    .sort((a, b) => {
      // Sort by name for better user experience
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit); // Apply limit
}