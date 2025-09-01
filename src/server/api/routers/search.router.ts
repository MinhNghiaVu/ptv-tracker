import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { logger } from "~/utils/logger";
import { searchStops } from "~/server/controllers/search.controller"; // Import function directly

// ==============================
// INPUT/OUTPUT SCHEMAS (Data Transfer Objects)
// ==============================

/**
 * Schema for stop search input validation
 */
const stopSearchInputSchema = z.object({
  query: z.string()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query too long")
    .trim(),
  limit: z.number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10),
});

/**
 * Schema for stop search output validation
 */
const stopSearchOutputSchema = z.object({
  stops: z.array(z.object({
    id: z.number(),
    name: z.string(),
    suburb: z.string().nullable(),
    routeType: z.number(),
    latitude: z.number(),
    longitude: z.number(),
  })),
  totalCount: z.number(),
  searchTime: z.number(), // milliseconds
});

// ==============================
// SEARCH ROUTER
// ==============================

export const searchRouter = createTRPCRouter({
  /** 
   * STOPS SEARCH ENDPOINT - /api/trpc/search.stops
   */
  stops: publicProcedure
    .input(stopSearchInputSchema)
    .output(stopSearchOutputSchema)
    .query(async ({ input }) => {
      const startTime = Date.now();
      
      try {
        logger.info(`[SEARCH_ROUTER] Stop search initiated: "${input.query}"`);
        
        // Call the functional controller directly
        const result = await searchStops({
          query: input.query,
          limit: input.limit,
        });
        
        const duration = Date.now() - startTime;
        logger.info(`[SEARCH_ROUTER] Stop search completed in ${duration}ms`);
        
        return {
          ...result,
          searchTime: duration
        };
        
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`[SEARCH_ROUTER] Stop search failed after ${duration}ms: ${errorMessage}`);
        
        // Return a user-friendly error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Search failed. Please try again.',
          cause: error,
        });
      }
    })
});

// Export types for use in frontend
export type StopSearchInput = z.infer<typeof stopSearchInputSchema>;
export type StopSearchOutput = z.infer<typeof stopSearchOutputSchema>;