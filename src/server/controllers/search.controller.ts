import { logger } from "~/utils/logger";
import type { IResponse } from "../interfaces/response.interface";
import type { PtvResultStop } from "../interfaces/ptv/ptvSearch.interface";
import { searchStops as searchStopsService } from "../services/search.service";


export async function searchStopsController(
  query: string,
  limit?: number
): Promise<IResponse<PtvResultStop[]>> {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: false,
        message: "Search query too short.",
        data: [],
      };
    }
    const { stops } = await searchStopsService(query);
    const limitedStops = limit ? stops.slice(0, limit) : stops;
    return {
      success: true,
      data: limitedStops,
    };
  } catch (error) {
    logger.error(`[SEARCH_CONTROLLER] Error: ${error}`);
    return {
      success: false,
      message: "Failed to search stops.",
      data: [],
    };
  }
}

// Dead code - potential future improvements

// function sanitiseSearchQuery(query: string): string {
//   return   query
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z0-9\s\-']/gi, '') // Keep letters, numbers, spaces, hyphens, apostrophes
//     .replace(/\s+/g, ' ') // Normalise multiple spaces to single space
//     .replace(/^[\s\-]+|[\s\-]+$/g, ''); // Remove leading/trailing spaces and hyphens
// }

// function processStopResults(stops: Stop[], limit: number): ProcessedStop[] {
//   if (!Array.isArray(stops)) {
//     logger.warn(`[SEARCH_CONTROLLER] Expected array of stops, got: ${typeof stops}`);
//     return [];
//   }

//   return stops
//     .map(stop => {
//       // Transform PTV API format to our standard format
//       try {
//         return {
//           id: stop.stop_id, // Already a number from interface
//           name: stop.stop_name || 'Unknown Stop',
//           suburb: stop.stop_suburb || null,
//           routeType: stop.route_type, // Already a number from interface
//           latitude: stop.stop_latitude, // Already a number from interface
//           longitude: stop.stop_longitude, // Already a number from interface
//         };
//       } catch (error) {
//         logger.warn(`[SEARCH_CONTROLLER] Failed to transform stop ${stop.stop_name}'s data: ${error}`);
//         return null;
//       }
//     })
//     .filter((stop): stop is ProcessedStop => {
//       // Filter out invalid stops
//       return stop !== null && stop.id > 0 && stop.name !== 'Unknown Stop';
//     })
//     .filter((stop, index, array) => {
//       // Remove duplicates based on stop ID
//       return array.findIndex(s => s.id === stop.id) === index;
//     })
//     .sort((a, b) => {
//       // Sort by name for better user experience
//       return a.name.localeCompare(b.name);
//     })
//     .slice(0, limit); // Apply limit
// }