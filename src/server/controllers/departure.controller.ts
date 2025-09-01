import { logger } from "~/utils/logger";
import type { ProcessedDeparture, Departure } from "../interfaces/departure.interface";
import { getDepartures as ptvGetDepartures } from "../services/ptv.service";

// ==============================
// DEPARTURES CONTROLLER
// ==============================

export async function getDepartures(input: { 
  stopId: number; 
  routeType?: number;
  limit?: number;
}): Promise<{
  departures: ProcessedDeparture[];
  totalCount: number;
}> {
  try {
    const limit = input.limit ?? 20; // Default limit
    
    // Validate stop ID
    if (input.stopId <= 0) {
      logger.warn(`[DEPARTURES_CONTROLLER] Invalid stop ID: ${input.stopId}`);
      return {
        departures: [],
        totalCount: 0,
      };
    }

    logger.info(`[DEPARTURES_CONTROLLER] Getting departures for stop: ${input.stopId}, route type: ${input.routeType ?? 'all'}`);

    // Call PTV service to get departures
    const ptvResults = await ptvGetDepartures(input.stopId, input.routeType);

    // Process results
    const processedDepartures = processDepartureResults(ptvResults.departures, limit);

    // Return formatted results
    const result = {
      departures: processedDepartures,
      totalCount: ptvResults.departures?.length || processedDepartures.length,
    };

    logger.info(`[DEPARTURES_CONTROLLER] Departures retrieved: ${processedDepartures.length} found`);
    return result;

  } catch (error) {
    logger.error(`[DEPARTURES_CONTROLLER] Get departures failed: ${error}`);
    throw error;
  }
}

// ==============================
// HELPER FUNCTIONS
// ==============================

function processDepartureResults(departures: Departure[], limit: number): ProcessedDeparture[] {
  if (!Array.isArray(departures)) {
    logger.warn(`[DEPARTURES_CONTROLLER] Expected array of departures, got: ${typeof departures}`);
    return [];
  }

  return departures
    .map(departure => {
      try {
        const scheduledTime = new Date(departure.scheduled_departure_utc);
        const estimatedTime = new Date(departure.estimated_departure_utc);
        const now = new Date();
        
        // Calculate minutes until departure (use estimated if available, otherwise scheduled)
        const departureTime = departure.estimated_departure_utc ? estimatedTime : scheduledTime;
        const minutesUntil = Math.round((departureTime.getTime() - now.getTime()) / (1000 * 60));
        
        // Check if delayed (estimated time is later than scheduled)
        const isDelayed = departure.estimated_departure_utc && 
          estimatedTime.getTime() > scheduledTime.getTime();

        return {
          routeId: departure.route_id,
          routeName: departure.route_name,
          directionName: departure.direction_name,
          scheduledDepartureUtc: departure.scheduled_departure_utc,
          estimatedDepartureUtc: departure.estimated_departure_utc,
          platformNumber: departure.platform_number || null,
          minutesUntilDeparture: minutesUntil,
          isDelayed: isDelayed || false,
        };
      } catch (error) {
        logger.warn(`[DEPARTURES_CONTROLLER] Failed to transform departure ${departure.direction_name} data: ${error}`);
        return null;
      }
    })
    .filter((departure): departure is ProcessedDeparture => departure !== null)
    .filter(departure => departure.minutesUntilDeparture >= 0) // Only show future departures
    .sort((a, b) => a.minutesUntilDeparture - b.minutesUntilDeparture) // Sort by departure time
    .slice(0, limit); // Apply limit
}