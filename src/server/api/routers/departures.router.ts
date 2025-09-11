import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { logger } from "~/utils/logger";
import { getDeparturesController } from "~/server/controllers/departure.controller";

const departureInputSchema = z.object({
  stopId: z.number().min(1),
  routeType: z.number().min(0).max(2),
  limit: z.number().min(1).max(50).default(20),
  routeId: z.number().optional(),
});

const departureOutputSchema = z.object({
  departures: z.array(z.object({
    routeId: z.number(),
    routeName: z.string(),
    directionName: z.string(),
    scheduledDepartureUtc: z.string(),
    estimatedDepartureUtc: z.string(),
    platformNumber: z.string().nullable(),
    minutesUntilDeparture: z.number(),
    isDelayed: z.boolean(),
  })),
  totalCount: z.number(),
  searchTime: z.number(),
});

export const departuresRouter = createTRPCRouter({
  get: publicProcedure
    .input(departureInputSchema)
    .output(departureOutputSchema)
    .query(async ({ input }) => {
      const startTime = Date.now();
      try {
        logger.info(`[DEPARTURES_ROUTER] Departures request for stop: ${input.stopId}`);
        const result = await getDeparturesController(input.stopId, input.routeType, input.routeId);
        const departures = (result.data ?? []).map(dep => {
          const scheduled = dep.scheduled_departure_utc ? new Date(dep.scheduled_departure_utc) : null;
          const estimated = dep.estimated_departure_utc ? new Date(dep.estimated_departure_utc) : scheduled;
          const now = Date.now();
          const minutesUntilDeparture =
            estimated && scheduled ? Math.max(0, Math.round((estimated.getTime() - now) / 60000)) : 0;
          return {
            routeId: dep.route_id ?? 0,
            routeName: "Unknown", // You can fetch from expanded routes if needed
            directionName: "Unknown", // You can fetch from expanded directions if needed
            scheduledDepartureUtc: dep.scheduled_departure_utc ?? "",
            estimatedDepartureUtc: dep.estimated_departure_utc ?? dep.scheduled_departure_utc ?? "",
            platformNumber: dep.platform_number ?? null,
            minutesUntilDeparture,
            isDelayed: !!(estimated && scheduled && estimated.getTime() > scheduled.getTime()),
          };
        });
        const duration = Date.now() - startTime;
        return {
          departures,
          totalCount: departures.length,
          searchTime: duration,
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`[DEPARTURES_ROUTER] Departures request failed after ${duration}ms: ${error}`);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get departures. Please try again.',
          cause: error,
        });
      }
    }),
});