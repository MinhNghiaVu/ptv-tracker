import { logger } from "~/utils/logger";
import type { IResponse } from "../interfaces/response.interface";
import type { PtvDeparture } from "../interfaces/ptv/ptvDeparture.interface";
import { getDepartures as getDeparturesService } from "../services/departure.service";

export async function getDeparturesController(
  stopId: number,
  routeType: number,
  routeId?: number
): Promise<IResponse<PtvDeparture[]>> {
  try {
    if (!stopId || !routeType) {
      return {
        success: false,
        message: "stopId and routeType are required.",
        data: [],
      };
    }
    const { departures } = await getDeparturesService(stopId, routeType, routeId);
    return {
      success: true,
      data: departures,
    };
  } catch (error) {
    logger.error(`[DEPARTURES_CONTROLLER] Error: ${error}`);
    return {
      success: false,
      message: "Failed to get departures.",
      data: [],
    };
  }
}

// Dead code - potential future improvements

// function processDepartureResults(departures: Departure[], limit: number): ProcessedDeparture[] {
//   if (!Array.isArray(departures)) {
//     logger.warn(`[DEPARTURES_CONTROLLER] Expected array of departures, got: ${typeof departures}`);
//     return [];
//   }

//   return departures
//     .map(departure => {
//       try {
//         const scheduledTime = new Date(departure.scheduled_departure_utc);
//         const estimatedTime = new Date(departure.estimated_departure_utc);
//         const now = new Date();
        
//         // Calculate minutes until departure (use estimated if available, otherwise scheduled)
//         const departureTime = departure.estimated_departure_utc ? estimatedTime : scheduledTime;
//         const minutesUntil = Math.round((departureTime.getTime() - now.getTime()) / (1000 * 60));
        
//         // Check if delayed (estimated time is later than scheduled)
//         const isDelayed = departure.estimated_departure_utc && 
//           estimatedTime.getTime() > scheduledTime.getTime();

//         return {
//           routeId: departure.route_id,
//           routeName: departure.route_name,
//           directionName: departure.direction_name,
//           scheduledDepartureUtc: departure.scheduled_departure_utc,
//           estimatedDepartureUtc: departure.estimated_departure_utc,
//           platformNumber: departure.platform_number || null,
//           minutesUntilDeparture: minutesUntil,
//           isDelayed: isDelayed || false,
//         };
//       } catch (error) {
//         logger.warn(`[DEPARTURES_CONTROLLER] Failed to transform departure ${departure.direction_name} data: ${error}`);
//         return null;
//       }
//     })
//     .filter((departure): departure is ProcessedDeparture => departure !== null)
//     .filter(departure => departure.minutesUntilDeparture >= 0) // Only show future departures
//     .sort((a, b) => a.minutesUntilDeparture - b.minutesUntilDeparture) // Sort by departure time
//     .slice(0, limit); // Apply limit
// }