import { logger } from "~/utils/logger";
import crypto from "crypto";
import type { PtvResultStop, PtvSearchResult } from "../interfaces/ptv/ptvSearch.interface";
import type { PtvDeparture, PtvDeparturesResponse } from "../interfaces/ptv/ptvDeparture.interface";

const PTV_USER_ID = process.env.PTV_USER_ID!;
const PTV_API_KEY = process.env.PTV_API_KEY!;
const PTV_BASE_URL = process.env.PTV_BASE_URL ?? 'https://timetableapi.ptv.vic.gov.au';

/**
 * Search for stops using /v3/search/{search_term} endpoint
 */
export async function searchStops(query: string): Promise<{ stops: PtvResultStop[] }> {
  try {
    // Check if we have API credentials
    if (!PTV_USER_ID || !PTV_API_KEY) {
      logger.warn(`[PTV_SERVICE] No PTV API credentials found`);
      return { stops: [] };
    }
    const endpoint = `/v3/search/${encodeURIComponent(query)}`;
    const data: PtvSearchResult = await makePtvRequest<PtvSearchResult>(endpoint);
    logger.info(`[PTV_SERVICE] PTV API returned ${data.stops?.length ?? 0} stops for query "${query}"`);
    return {
      stops: data.stops ?? [],
    };
  }
  catch (error) {
    logger.error(`[PTV_SERVICE] PTV API call failed: ${error}`);
    return { stops: [] };
  }
}

/**
 * Get departures for a stop using /v3/departures/route_type/{route_type}/stop/{stop_id} endpoint
 * Optionally filter by route ID
 */
export async function getDepartures(stopId: number, routeType: number, routeId?: number): Promise<{ departures: PtvDeparture[] }> {
  try {
    if (!PTV_USER_ID || !PTV_API_KEY) {
      logger.warn(`[PTV_SERVICE] No PTV API credentials found`);
      return { departures: [] };
    }

    let endpoint = `/v3/departures/route_type/${routeType}/stop/${stopId}`;
    if (routeId !== undefined) {
      endpoint += `/route/${routeId}`;
    }

    const params = new URLSearchParams({
      max_results: '20',
      include_cancelled: 'false',
      look_backwards: 'false',
      expand: 'run,route,stop,direction',
    });

    endpoint += `?${params.toString()}`;

    const data: PtvDeparturesResponse = await makePtvRequest<PtvDeparturesResponse>(endpoint);

    logger.info(`[PTV_SERVICE] PTV API returned ${data.departures?.length ?? 0} departures for stop ${stopId}`);

    return {
      departures: data.departures ?? []
    };

  } catch (error) {
    logger.error(`[PTV_SERVICE] PTV API call failed: ${error}`);
    return { departures: [] };
  }
}

/**
 * Make authenticated request to PTV API, updated to use different return types
 */
async function makePtvRequest<T>(endpoint: string): Promise<T> {
  const url = buildPtvUrl(endpoint);
  
  logger.info(`[PTV_SERVICE] Making request to: ${endpoint}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PTV-Tracker/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`PTV API error: ${response.status} ${response.statusText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: T = await response.json();
  return data;
}

/**
 * Generate PTV API signature for authentication
 */
function generateSignature(request: string): string {
  const key = PTV_API_KEY;
  const signature = crypto
    .createHmac('sha1', key) // HMAC-SHA1 as specified in PTV API documentation
    .update(request)
    .digest('hex')
    .toUpperCase();
  return signature;
}

/**
 * Build authenticated PTV API URL
 */
function buildPtvUrl(endpoint: string): string {
  const request = `${endpoint}${endpoint.includes('?') ? '&' : '?'}devid=${PTV_USER_ID}`;
  const signature = generateSignature(request);
  return `${PTV_BASE_URL}${request}&signature=${signature}`;
}