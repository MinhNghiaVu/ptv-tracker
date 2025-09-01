import crypto from 'crypto';
import { logger } from "~/utils/logger";

/**
 * Get data straight from the ptv api
 */
export class PTVApiService {
  private baseUrl = 'https://timetableapi.ptv.vic.gov.au';
  
  /**
   * SEARCH STOPS - Simple version
   */
  async searchStops(query: string): Promise<{
    stops: any[];
    totalCount: number;
  }> {
    try {
      logger.info(`[PTV_SERVICE] Searching stops for: "${query}"`);
      
      // Just call the API directly (or mock data)
      const apiResponse = await this.makeStopsSearchApiCall(query);
      const transformedResult = this.transformStopsResponse(apiResponse);
      
      return transformedResult;

    } catch (error) {
      logger.error(`[PTV_SERVICE] Stops search failed for "${query}": ${error}`);
      throw new Error(`Failed to search stops: ${error}`);
    }
  }

  /**
   * GET DEPARTURES - Simple version
   */
  async getDepartures(stopId: number, routeType?: number): Promise<{
    departures: any[];
  }> {
    try {
      logger.info(`[PTV_SERVICE] Getting departures for stop: ${stopId}`);
      
      const apiResponse = await this.makeDeparturesApiCall(stopId, routeType);
      const transformedResult = this.transformDeparturesResponse(apiResponse);

      return transformedResult;

    } catch (error) {
      logger.error(`[PTV_SERVICE] Departures failed for stop ${stopId}: ${error}`);
      throw new Error(`Failed to get departures: ${error}`);
    }
  }
}