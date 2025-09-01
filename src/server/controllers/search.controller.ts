import { logger } from "~/utils/logger";
import { PTVApiService } from "~/server/services/ptv-api.service";
import { RecentSearchService } from "~/server/services/recent-search.service";
import type { StopSearchInput, StopSearchOutput } from "../api/routers/search.router";

// ==============================
// SEARCH CONTROLLER
// ==============================
export class SearchController {
  private ptvApiService: PTVApiService;
  private recentSearchService: RecentSearchService;
  
  constructor() {
    // Initialise services
    this.ptvApiService = new PTVApiService();
    this.recentSearchService = new RecentSearchService();
  }

  /**
   * APPROACH:
   * Validate and sanitise input
   * -> Check cache through PTV service
   * -> Make PTV API call if needed
   * -> Apply business rules (filtering, sorting, deduplication)
   * -> Save successful searches to recent history
   * -> Return formatted results
   */
  async searchStops(input: StopSearchInput): Promise<Omit<StopSearchOutput, 'searchTime'>> {
    try {
      // Sanitise and validate search query
      const sanitisedQuery = this.sanitiseSearchQuery(input.query);

      if (sanitisedQuery.length < 2) {
        logger.warn(`[SEARCH_CONTROLLER] Search query too short after sanitisation: "${input.query}"`);
        return {
          stops: [],
          totalCount: 0,
          cached: false,
        };
      }

      logger.info(`[SEARCH_CONTROLLER] Processing stop search: "${sanitisedQuery}" for session: ${input.sessionId}`);

      // Call PTV API service to get stops (includes caching logic)
      const ptvResults = await this.ptvApiService.searchStops(sanitisedQuery);

      // Process results
      const processedStops = this.processStopResults(ptvResults.stops, input.limit);

      // Only save successful searches with results to history
      if (processedStops.length > 0) {
        await this.saveSearchToHistory(input.sessionId, sanitisedQuery, processedStops);
      } else {
        logger.info(`[SEARCH_CONTROLLER] No results found for: "${sanitisedQuery}"`);
      }

      // Return formatted results
      const result = {
        stops: processedStops,
        totalCount: ptvResults.totalCount || processedStops.length,
        cached: ptvResults.cached || false,
      };

      logger.info(`[SEARCH_CONTROLLER] Search completed: ${processedStops.length} stops found, cached: ${result.cached}`);
      return result;

    } catch (error) {
      logger.error(`[SEARCH_CONTROLLER] Search stops failed: ${error}`);
      throw error; // Re-throw for router to handle
    }
  }

  /**
   * APPROACH:
   * Fetch from recent search service
   * -> Apply business rules (exclude certain types, limit results)
   * -> Transform for presentation layer
   * -> Return user-friendly format
   */
  async getRecentSearches(input: { sessionId: string; limit: number }) {
    try {
      logger.info(`[SEARCH_CONTROLLER] Fetching recent searches for session: ${input.sessionId}`);

      // Fetch recent searches from service layer
      const recentSearches = await this.recentSearchService.getBySession(
        input.sessionId, 
        input.limit
      );

      // Transform for presentation and add preview data
      const transformedSearches = recentSearches.map(search => ({
        id: search.id,
        query: search.query,
        searchType: search.searchType,
        searchedAt: search.searchedAt,
        resultPreview: {
          topResult: this.extractTopResult(search.resultData),
          resultCount: this.countResults(search.resultData),
        },
      }));

      logger.info(`[SEARCH_CONTROLLER] Returning ${transformedSearches.length} recent searches`);
      return transformedSearches;

    } catch (error) {
      logger.error(`[SEARCH_CONTROLLER] Get recent searches failed: ${error}`);
      throw error;
    }
  }

  // ============================================
  // PRIVATE HELPER METHODS (Business Logic)
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
   * Logic
   * - Remove duplicates based on stop ID
   * - Sort by relevance (exact matches first, then partial)
   * - Apply result limit
   * - Ensure required fields are present
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
        // Business rule: Sort by name for better user experience
        return a.name.localeCompare(b.name);
      })
      .slice(0, limit); // Apply limit
  }

  /**
   * Save successful search to history
   */
  private async saveSearchToHistory(sessionId: string, query: string, results: any[]) {
    try {
      const searchData = {
        query,
        resultsCount: results.length,
        topResult: results[0]?.name || null,
        searchedAt: new Date().toISOString(),
        // Store a preview of the results for quick access
        resultSummary: results.slice(0, 3).map(r => ({
          id: r.id,
          name: r.name,
          suburb: r.suburb,
        })),
      };

      await this.recentSearchService.addSearch(
        sessionId,
        query,
        'stop_search',
        searchData
      );

      logger.info(`[SEARCH_CONTROLLER] Saved search to history: "${query}" (${results.length} results)`);
    } catch (error) {
      // Don't fail the main search if history save fails
      logger.warn(`[SEARCH_CONTROLLER] Failed to save search history: ${error}`);
    }
  }

  /**
   * Extract top result from search data for preview
   */
  private extractTopResult(resultData: any): string | null {
    try {
      const parsed = typeof resultData === 'string' ? JSON.parse(resultData) : resultData;
      return parsed.topResult || parsed.resultSummary?.[0]?.name || null;
    } catch (error) {
      logger.warn(`[SEARCH_CONTROLLER] Failed to extract top result: ${error}`);
      return null;
    }
  }

  /**
   * Count results from search data
   */
  private countResults(resultData: any): number {
    try {
      const parsed = typeof resultData === 'string' ? JSON.parse(resultData) : resultData;
      return parsed.resultsCount || parsed.resultSummary?.length || 0;
    } catch (error) {
      logger.warn(`[SEARCH_CONTROLLER] Failed to count results: ${error}`);
      return 0;
    }
  }

  /**
   * Validate that a stop has all required fields
   */
  private isValidStop(stop: any): boolean {
    return (
      stop &&
      typeof stop.stop_id !== 'undefined' &&
      typeof stop.stop_name === 'string' &&
      stop.stop_name.trim().length > 0 &&
      typeof stop.stop_latitude !== 'undefined' &&
      typeof stop.stop_longitude !== 'undefined'
    );
  }
}