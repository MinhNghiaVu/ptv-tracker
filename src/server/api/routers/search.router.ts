import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { logger } from "~/utils/logger";
import { SearchController } from "~/server/controllers/search.controller";

// ============================================
// INPUT/OUTPUT SCHEMAS (Data Transfer Objects)
// ============================================

/**
 * Schema for stop search input validation
 * This ensures we receive valid data from the frontend
 */
const stopSearchInputSchema = z.object({
  query: z.string()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query too long")
    .trim(),
  sessionId: z.string()
    .min(1, "Session ID required"),
  limit: z.number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10),
});

/**
 * Schema for stop search output validation
 * This ensures we return consistent data structure
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
  cached: z.boolean(),
  searchTime: z.number(), // milliseconds
});

/**
 * Schema for recent searches output
 */
const recentSearchesOutputSchema = z.array(z.object({
  id: z.string(),
  query: z.string(),
  searchType: z.string(),
  searchedAt: z.date(),
  resultPreview: z.object({
    topResult: z.string().nullable(),
    resultCount: z.number(),
  }),
}));

// ============================================
// TRPC ROUTER DEFINITION
// ============================================

export const searchRouter = createTRPCRouter({
  // STOPS SEARCH ENDPOINT
  stops: publicProcedure
    .input(stopSearchInputSchema)
    .output(stopSearchOutputSchema)
    .query(async ({ input, ctx }) => {
      const startTime = Date.now();
      
      try {
        logger.info(`[SEARCH] Stop search initiated: "${input.query}" (session: ${input.sessionId})`);
        
        // Delegate to controller layer
        // Controller handles business logic and coordinates services
        const controller = new SearchController();
        const result = await controller.searchStops(input);
        
        const duration = Date.now() - startTime;
        logger.info(`[SEARCH] Stop search completed in ${duration}ms`);
        
        return {
          ...result,
          searchTime: duration
        };
        
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`[SEARCH] Stop search failed after ${duration}ms: ${error}`);
        
        // Convert internal errors to user-friendly tRPC errors
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Search failed. Please try again.',
            cause: error,
          });
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),

  /**
   * RECENT SEARCHES ENDPOINT
   * Retrieves user's recent searches for quick access
   * 
   * Example usage:
   * const recent = await api.search.recentSearches.useQuery({
   *   sessionId: "abc123"
   * });
   */
  recentSearches: publicProcedure
    .input(z.object({
      sessionId: z.string().min(1, "Session ID required"),
      limit: z.number().min(1).max(20).default(10),
    }))
    .output(recentSearchesOutputSchema)
    .query(async ({ input }) => {
      try {
        logger.info(`[SEARCH] Fetching recent searches for session: ${input.sessionId}`);
        
        const controller = new SearchController();
        const recentSearches = await controller.getRecentSearches(input);
        
        logger.info(`[SEARCH] Found ${recentSearches.length} recent searches`);
        return recentSearches;
        
      } catch (error) {
        logger.error(`[SEARCH] Failed to fetch recent searches: ${error}`);
        
        // For recent searches, we can fail gracefully and return empty array
        // This is not critical functionality
        return [];
      }
    }),
});

// Export types for use in frontend
export type StopSearchInput = z.infer<typeof stopSearchInputSchema>;
export type StopSearchOutput = z.infer<typeof stopSearchOutputSchema>;