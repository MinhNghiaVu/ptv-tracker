import { logger } from "~/utils/logger";
import type { PtvDeparture } from "~/server/interfaces/ptv/ptvDeparture.interface";
import { getDepartures as ptvGetDepartures } from "./ptv.service";

/**
 * GET DEPARTURES
 */
export async function getDepartures(
  stopId: number,
  routeType: number,
  routeId?: number
): Promise<{
  departures: PtvDeparture[];
}> {
  try {
    logger.info(`[SEARCH_SERVICE] Getting departures for stop: ${stopId}`);
    const { departures } = await ptvGetDepartures(stopId, routeType, routeId);
    return { 
      departures
    };
  } catch (error) {
    logger.error(`[SEARCH_SERVICE] Departures failed for stop ${stopId}: ${error}`);
    throw new Error(`Failed to get departures: ${error}`);
  }
}