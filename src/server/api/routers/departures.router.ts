import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { logger } from "~/utils/logger";
import { getDepartures } from "~/server/controllers/departure.controller";

// ==============================
// INPUT/OUTPUT SCHEMAS
// ==============================

/**
 * Schema for departure input validation
 */
const departureInputSchema = z.object({
  stopId: z.number()
    .min(1, "Stop ID must be a positive number"),
  routeType: z.number()
    .min(0, "Route type must be 0 (train), 1 (tram), or 2 (bus)")
    .max(2, "Route type must be 0 (train), 1 (tram), or 2 (bus)")
    .optional(),
  limit: z.number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(20),
});

/**
 * Schema for departure output validation
 */
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

// ==============================
// DEPARTURES ROUTER
// ==============================

export const departureRouter = createTRPCRouter({
  /** 
   * GET DEPARTURES ENDPOINT - /api/trpc/departure.get
   */
  get: publicProcedure
    .input(departureInputSchema)
    .output(departureOutputSchema)
    .query(async ({ input }) => {
      const startTime = Date.now();
      
      try {
        logger.info(`[DEPARTURES_ROUTER] Departures request for stop: ${input.stopId}`);
        
        // Call the functional controller directly
        const result = await getDepartures({
          stopId: input.stopId,
          routeType: input.routeType,
          limit: input.limit,
        });
        
        const duration = Date.now() - startTime;
        logger.info(`[DEPARTURES_ROUTER] Departures retrieved in ${duration}ms`);
        
        return {
          ...result,
          searchTime: duration
        };
        
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`[DEPARTURES_ROUTER] Departures request failed after ${duration}ms: ${errorMessage}`);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get departures. Please try again.',
          cause: error,
        });
      }
    })
});

// Export types for use in frontend
export type DeparturesInput = z.infer<typeof departureInputSchema>;
export type DeparturesOutput = z.infer<typeof departureOutputSchema>;