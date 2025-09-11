import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { logger } from "~/utils/logger";
import { searchStopsController } from "~/server/controllers/search.controller";

const stopSearchInputSchema = z.object({
  query: z.string().min(1).max(100).trim(),
  limit: z.number().min(1).max(50).default(10),
});

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
  searchTime: z.number(),
});

export const searchRouter = createTRPCRouter({
  stops: publicProcedure
    .input(stopSearchInputSchema)
    .output(stopSearchOutputSchema)
    .query(async ({ input }) => {
      const startTime = Date.now();
      try {
        logger.info(`[SEARCH_ROUTER] Stop search initiated: "${input.query}"`);
        const result = await searchStopsController(input.query, input.limit);

        // Transform PtvResultStop[] to output shape
        const stops = (result.data ?? []).map(stop => ({
          id: stop.stop_id ?? 0,
          name: stop.stop_name ?? "Unknown Stop",
          suburb: stop.stop_suburb ?? null,
          routeType: stop.route_type ?? -1,
          latitude: stop.stop_latitude ?? 0,
          longitude: stop.stop_longitude ?? 0,
        }));

        const duration = Date.now() - startTime;
        logger.info(`[SEARCH_ROUTER] Stop search completed in ${duration}ms`);

        return {
          stops,
          totalCount: stops.length,
          searchTime: duration,
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`[SEARCH_ROUTER] Stop search failed after ${duration}ms: ${error}`);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Search failed. Please try again.',
          cause: error,
        });
      }
    }),
});