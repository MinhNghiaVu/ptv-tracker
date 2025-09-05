import { logger } from "~/utils/logger";
import type { Stop } from "~/server/interfaces/stop.interface";
import type { Departure } from "~/server/interfaces/departure.interface";
import crypto from "crypto";

const PTV_USER_ID = process.env.PTV_USER_ID!;
const PTV_API_KEY = process.env.PTV_API_KEY!;
const PTV_BASE_URL = process.env.PTV_BASE_URL ?? 'https://timetableapi.ptv.vic.gov.au';

/**
 * Search for stops using PTV API
 */
export async function searchStopsApi(query: string): Promise<{ stops: Stop[] }> {
  try {
    // Check if we have API credentials
    if (!PTV_USER_ID || !PTV_API_KEY) {
      logger.warn(`[PTV_SERVICE] No PTV API credentials found`);
      return { stops: [] };
    }

    // Build endpoint with query
    const endpoint = `/v3/search/${encodeURIComponent(query)}`;
    const data = await makePtvRequest(endpoint);
    
    logger.info(`[PTV_SERVICE] PTV API returned ${data.stops?.length ?? 0} stops for "${query}"`);
    
    // PTV API returns stops in data.stops array
    return {
      stops: data.stops ?? []
    };

  } catch (error) {
    logger.error(`[PTV_SERVICE] PTV API call failed: ${error}`);
  }
}

/**
 * Make authenticated request to PTV API
 */
async function makePtvRequest(endpoint: string): Promise<any> {
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

  const data = await response.json();
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