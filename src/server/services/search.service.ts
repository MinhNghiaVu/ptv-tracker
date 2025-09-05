import { logger } from "~/utils/logger";
import type { Stop } from "~/server/interfaces/stop.interface";
import type { Departure } from "~/server/interfaces/departure.interface";

/**
 * SEARCH STOPS
 */
export async function searchStops(query: string): Promise<{
  stops: Stop[];
  totalCount: number;
}> {
  try {
    logger.info(`[PTV_SERVICE] Searching stops for: "${query}"`);
    
    const apiResponse = await makeStopsSearchApiCall(query);
    const transformedResult = transformStopsResponse(apiResponse);
    
    return transformedResult;

  } catch (error) {
    logger.error(`[PTV_SERVICE] Stops search failed for "${query}": ${error}`);
    throw new Error(`Failed to search stops: ${error}`);
  }
}

/**
 * GET DEPARTURES
 */
export async function getDepartures(stopId: number, routeType?: number): Promise<{
  departures: Departure[];
}> {
  try {
    logger.info(`[PTV_SERVICE] Getting departures for stop: ${stopId}`);

    const apiResponse = await makeDeparturesApiCall(stopId, routeType);
    const transformedResult = transformDeparturesResponse(apiResponse);

    return transformedResult;

  } catch (error) {
    logger.error(`[PTV_SERVICE] Departures failed for stop ${stopId}: ${error}`);
    throw new Error(`Failed to get departures: ${error}`);
  }
}

// ==============================
// PRIVATE FUNCTIONS 
// ==============================

async function makeStopsSearchApiCall(query: string): Promise<{ stops: Stop[] }> {
  try {
    logger.info(`[PTV_SERVICE] Using mock data for development`);
    return getMockStopsData(query);
  } catch (error) {
    logger.error(`[PTV_SERVICE] API call failed: ${error}`);
    throw error;
  }
}

async function makeDeparturesApiCall(stopId: number, routeType?: number): Promise<{ departures: Departure[] }> {
  logger.info(`[PTV_SERVICE] Using mock departures data for development`);
  return getMockDeparturesData(stopId, routeType);
}

function transformStopsResponse(apiResponse: { stops: Stop[] }): { 
  stops: Stop[]; 
  totalCount: number; 
} {
  const stops = apiResponse.stops || [];
  
  const transformedStops: Stop[] = stops.map(stop => ({
    stop_id: stop.stop_id,
    stop_name: stop.stop_name,
    stop_suburb: stop.stop_suburb,
    route_type: stop.route_type,
    stop_latitude: stop.stop_latitude,
    stop_longitude: stop.stop_longitude,
  }));

  return {
    stops: transformedStops,
    totalCount: stops.length,
  };
}

function transformDeparturesResponse(apiResponse: { departures: Departure[] }): { 
  departures: Departure[]; 
} {
  const departures = apiResponse.departures || [];
  
  return {
    departures: departures.map(dep => ({
      route_id: dep.route_id,
      route_name: dep.route_name,
      direction_name: dep.direction_name,
      scheduled_departure_utc: dep.scheduled_departure_utc,
      estimated_departure_utc: dep.estimated_departure_utc,
      platform_number: dep.platform_number,
    })),
  };
}