import { logger } from "~/utils/logger";
import { PTVApiService } from "~/server/services/ptv.service";

// ==============================
// SIMPLIFIED SEARCH CONTROLLER
// ==============================
export class SearchController {
  private ptvApiService: PTVApiService;
  
  constructor() {
    // Only need PTV service
    this.ptvApiService = new PTVApiService();
  }

  /**
   * SIMPLIFIED APPROACH:
   * Validate and sanitise input
   * -> Call PTV API
   * -> Process and return results
   */
  async searchStops(input: { query: string; limit: number }): Promise<{
    stops: any[];
    totalCount: number;
  }> {
    try {
      // Sanitise and validate search query
      const sanitisedQuery = this.sanitiseSearchQuery(input.query);

      if (sanitisedQuery.length < 2) {
        logger.warn(`[SEARCH_CONTROLLER] Search query too short after sanitisation: "${input.query}"`);
        return {
          stops: [],
          totalCount: 0,
        };
      }

      logger.info(`[SEARCH_CONTROLLER] Processing stop search: "${sanitisedQuery}"`);

      // Call PTV API service to get stops
      const ptvResults = await this.ptvApiService.searchStops(sanitisedQuery);

      // Process results
      const processedStops = this.processStopResults(ptvResults.stops, input.limit);

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

  /**
   * Basic sanitisation
   * - Remove dangerous characters
   * - Normalise whitespace
   * - Convert to consistent case
   */
  private sanitiseSearchQuery(query: string): string {
    return query
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s\-']/gi, '') // Keep letters, numbers, spaces, hyphens, apostrophes
      .replace(/\s+/g, ' ') // Normalise multiple spaces to single space
      .replace(/^[\s\-]+|[\s\-]+$/g, ''); // Remove leading/trailing spaces and hyphens
  }

  /**
   * Process stop results:
   * - Transform PTV format to our format
   * - Remove duplicates based on stop ID
   * - Sort by name
   * - Apply result limit
   * - Filter out invalid stops
   */
  private processStopResults(stops: any[], limit: number) {
    if (!Array.isArray(stops)) {
      logger.warn(`[SEARCH_CONTROLLER] Expected array of stops, got: ${typeof stops}`);
      return [];
    }

    return stops
      .map(stop => {
        // Transform PTV API format to our standard format
        try {
          return {
            id: parseInt(stop.stop_id) || 0,
            name: stop.stop_name || 'Unknown Stop',
            suburb: stop.stop_suburb || null,
            routeType: parseInt(stop.route_type) || 0,
            latitude: parseFloat(stop.stop_latitude) || 0,
            longitude: parseFloat(stop.stop_longitude) || 0,
          };
        } catch (error) {
          logger.warn(`[SEARCH_CONTROLLER] Failed to transform stop data: ${error}`, stop);
          return null;
        }
      })
      .filter((stop): stop is NonNullable<typeof stop> => {
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
};
