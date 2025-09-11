import { logger } from "~/utils/logger";
import type { PtvResultStop } from "~/server/interfaces/ptv/ptvSearch.interface";
import { searchStops as ptvSearchStops } from "./ptv.service";

/**
 * SEARCH STOPS
 */
export async function searchStops(
  query: string
): Promise<{
  stops: PtvResultStop[];
  totalCount: number;
}> {
  try {
    logger.info(`[SEARCH_SERVICE] Searching stops for: "${query}"`);
    const { stops } = await ptvSearchStops(query);
    return {
      stops,
      totalCount: stops.length,
    };
  } catch (error) {
    logger.error(`[SEARCH_SERVICE] Stops search failed for "${query}": ${error}`);
    throw new Error(`Failed to search stops: ${error}`);
  }
}
