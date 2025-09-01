/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions */
// eslint being an asshole
// import crypto from 'crypto';
import { logger } from "~/utils/logger";

// ==============================
// PTV SERVICE
// ==============================

const baseUrl = 'https://timetableapi.ptv.vic.gov.au';
  
/**
 * SEARCH STOPS
 */
export async function searchStops(query: string): Promise<{
  stops: any[];
  totalCount: number;
}> {
  try {
    logger.info(`[PTV_SERVICE] Searching stops for: "${query}"`);
    
    // TODO: Waiting for API Key and Dev ID rn, just use mock data
    const apiResponse = await makeStopsSearchApiCall(query);
    const transformedResult = transformStopsResponse(apiResponse);
    
    return transformedResult;

  } catch (error) {
    logger.error(`[PTV_SERVICE] Stops search failed for "${query}": ${error}`);
    throw new Error(`Failed to search stops: ${error}`);
  }
}

/**
 * GET DEPARTURES - Simple version
 */
export async function getDepartures(stopId: number, routeType?: number): Promise<{
  departures: any[];
}> {
  try {
    logger.info(`[PTV_SERVICE] Getting departures for stop: ${stopId}`);
    
    const apiResponse = await makeDeparturesApiCall(stopId, routeType);
    const transformedResult = transformDeparturesResponse(apiResponse);

    return transformedResult;

  } catch (error) {
    logger.error(`[PTV_SERVICE] Departures failed for stop ${stopId}: ${error}`);
    throw new Error(`Failed to get departures: ${error}`);
  }
}

// ==============================
// PRIVATE METHODS
// ==============================

/**
 * Make actual API call to PTV stops search endpoint
 */
async function makeStopsSearchApiCall(query: string): Promise<any> {
  try {
    // TODO: Replace with actual PTV API call later on
    logger.info(`[PTV_SERVICE] Using mock data for development`);
    // logger.info(`[PTV_SERVICE] Using data from PTV API`);
    return getMockStopsData(query);
    // return getStopsData(query);

  } catch (error) {
    logger.error(`[PTV_SERVICE] API call failed: ${error}`);
    throw error;
  }
}

/**
 * Make API call for departures
 */
async function makeDeparturesApiCall(stopId: number): Promise<any> {
  // For development: Return mock data
  logger.info(`[PTV_SERVICE] Using mock departures data for development`);
  return getMockDeparturesData(stopId);
}

/**
 * Transform PTV API response to our standard format
 */
function transformStopsResponse(apiResponse: any): { stops: any[]; totalCount: number } {
  const stops = apiResponse.stops ?? [];
  
  const transformedStops = stops.map((stop: any) => ({
    stop_id: stop.stop_id,
    stop_name: stop.stop_name,
    stop_suburb: stop.stop_suburb,
    route_type: stop.route_type,
    stop_latitude: stop.stop_latitude,
    stop_longitude: stop.stop_longitude,
  }));

  return {
    stops: transformedStops,
    totalCount: stops.length,
  };
}

/**
 * Transform departures response
 */
function transformDeparturesResponse(apiResponse: any): { departures: any[] } {
  const departures = apiResponse.departures ?? [];
  
  return {
    departures: departures.map((dep: any) => ({
      route_id: dep.route_id,
      route_name: dep.route_name,
      direction_name: dep.direction_name,
      scheduled_departure_utc: dep.scheduled_departure_utc,
      estimated_departure_utc: dep.estimated_departure_utc,
      platform_number: dep.platform_number,
    })),
  };
}

// ==============================
// MOCK DATA
// ==============================

/**
 * Mock data for development when PTV API is not available
 */
function getMockStopsData(query: string): any {
  const allMockStops = [
    // TRAIN STATIONS
    {
      stop_id: 1071,
      stop_name: "Flinders Street Station",
      stop_suburb: "Melbourne",
      route_type: 0, // Train
      stop_latitude: -37.8183,
      stop_longitude: 144.9671,
    },
    {
      stop_id: 3891,
      stop_name: "Melbourne Central Station",
      stop_suburb: "Melbourne",
      route_type: 0, // Train
      stop_latitude: -37.8098,
      stop_longitude: 144.9633,
    },
    {
      stop_id: 4521,
      stop_name: "Southern Cross Station",
      stop_suburb: "Melbourne",
      route_type: 0, // Train
      stop_latitude: -37.8184,
      stop_longitude: 144.9525,
    },
    {
      stop_id: 5123,
      stop_name: "Parliament Station",
      stop_suburb: "Melbourne",
      route_type: 0, // Train
      stop_latitude: -37.8112,
      stop_longitude: 144.9742,
    },
    {
      stop_id: 1155,
      stop_name: "Flagstaff Station",
      stop_suburb: "Melbourne",
      route_type: 0, // Train
      stop_latitude: -37.8120,
      stop_longitude: 144.9569,
    },

    // TRAM STOPS - Collins Street
    {
      stop_id: 2534,
      stop_name: "Collins St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8136,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 2710,
      stop_name: "Collins St/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8142,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 2855,
      stop_name: "Collins St/King St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8166,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 2901,
      stop_name: "Collins St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8170,
      stop_longitude: 144.9531,
    },
    {
      stop_id: 2455,
      stop_name: "Collins St/Russell St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8134,
      stop_longitude: 144.9692,
    },

    // TRAM STOPS - Bourke Street
    {
      stop_id: 3001,
      stop_name: "Bourke St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8143,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 3012,
      stop_name: "Bourke St/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8149,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 3024,
      stop_name: "Bourke St/King St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8173,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 3035,
      stop_name: "Bourke St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8177,
      stop_longitude: 144.9531,
    },
    {
      stop_id: 3046,
      stop_name: "Bourke St/Russell St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8141,
      stop_longitude: 144.9692,
    },

    // TRAM STOPS - Flinders Street
    {
      stop_id: 6234,
      stop_name: "Federation Square/Flinders St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8175,
      stop_longitude: 144.9692,
    },
    {
      stop_id: 6245,
      stop_name: "Flinders St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8183,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 6256,
      stop_name: "Flinders St/King St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8186,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 6267,
      stop_name: "Flinders St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8190,
      stop_longitude: 144.9531,
    },

    // TRAM STOPS - La Trobe Street
    {
      stop_id: 4001,
      stop_name: "La Trobe St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8102,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 4012,
      stop_name: "La Trobe St/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8108,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 4023,
      stop_name: "La Trobe St/King St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8131,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 4034,
      stop_name: "La Trobe St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8135,
      stop_longitude: 144.9531,
    },

    // TRAM STOPS - Swanston Street
    {
      stop_id: 5001,
      stop_name: "Melbourne University/Swanston St",
      stop_suburb: "Parkville",
      route_type: 1, // Tram
      stop_latitude: -37.7991,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 5012,
      stop_name: "RMIT/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8076,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 5023,
      stop_name: "Melbourne Town Hall/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8149,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 5034,
      stop_name: "Arts Centre/St Kilda Rd",
      stop_suburb: "Melbourne",
      route_type: 1, // Tram
      stop_latitude: -37.8216,
      stop_longitude: 144.9685,
    },

    // BUS STOPS - Major ones in CBD
    {
      stop_id: 7001,
      stop_name: "QV Centre/Lonsdale St",
      stop_suburb: "Melbourne",
      route_type: 2, // Bus
      stop_latitude: -37.8116,
      stop_longitude: 144.9642,
    },
    {
      stop_id: 7012,
      stop_name: "Flagstaff Gardens/William St",
      stop_suburb: "Melbourne",
      route_type: 2, // Bus
      stop_latitude: -37.8123,
      stop_longitude: 144.9547,
    },
    {
      stop_id: 7023,
      stop_name: "St Pauls Cathedral/Flinders St",
      stop_suburb: "Melbourne",
      route_type: 2, // Bus
      stop_latitude: -37.8171,
      stop_longitude: 144.9673,
    },
    {
      stop_id: 7034,
      stop_name: "Queen Victoria Market/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 2, // Bus
      stop_latitude: -37.8076,
      stop_longitude: 144.9571,
    },

    // POPULAR DESTINATIONS
    {
      stop_id: 8001,
      stop_name: "Crown Casino/Southbank",
      stop_suburb: "Southbank",
      route_type: 1, // Tram
      stop_latitude: -37.8266,
      stop_longitude: 144.9588,
    },
    {
      stop_id: 8012,
      stop_name: "Docklands Drive/Harbour Esplanade",
      stop_suburb: "Docklands",
      route_type: 1, // Tram
      stop_latitude: -37.8168,
      stop_longitude: 144.9459,
    },
    {
      stop_id: 8023,
      stop_name: "Melbourne Central Shopping Centre",
      stop_suburb: "Melbourne",
      route_type: 2, // Bus
      stop_latitude: -37.8098,
      stop_longitude: 144.9633,
    },
    {
      stop_id: 8034,
      stop_name: "Royal Melbourne Hospital",
      stop_suburb: "Parkville",
      route_type: 1, // Tram
      stop_latitude: -37.7994,
      stop_longitude: 144.9561,
    },

    // INNER CITY AREAS
    {
      stop_id: 9001,
      stop_name: "Richmond Station",
      stop_suburb: "Richmond",
      route_type: 0, // Train
      stop_latitude: -37.8268,
      stop_longitude: 144.9888,
    },
    {
      stop_id: 9012,
      stop_name: "South Yarra Station",
      stop_suburb: "South Yarra",
      route_type: 0, // Train
      stop_latitude: -37.8404,
      stop_longitude: 144.9888,
    },
    {
      stop_id: 9023,
      stop_name: "Prahran Station",
      stop_suburb: "Prahran",
      route_type: 0, // Train
      stop_latitude: -37.8505,
      stop_longitude: 144.9888,
    },
    {
      stop_id: 9034,
      stop_name: "Windsor Station",
      stop_suburb: "Windsor",
      route_type: 0, // Train
      stop_latitude: -37.8575,
      stop_longitude: 144.9888,
    },
  ];

  // Filter based on query - search in stop name, suburb, and nearby landmarks
  const queryLower = query.toLowerCase().trim();

  // Empty query -> all stops returned
  if (queryLower.length < 1) {
    return { stops: allMockStops };
  }

  // Search depending on query
  const searchResults = allMockStops
    .map(stop => {
      const score = calculateSearchScore(stop, queryLower);
      return { stop, score };
    })
    .filter(result => result.score > 0) // Only include matches
    .sort((a, b) => b.score - a.score) // Sort by best match first
    .map(result => result.stop); // Extract just the stops

  logger.info(`[PTV_SERVICE] Mock data: ${searchResults.length} stops found for "${query}"`);
  return { stops: searchResults };
}

/**
 * Fuzzy search - thanks Claude
 */
function calculateSearchScore(stop: any, query: string): number {
  const stopName = stop.stop_name.toLowerCase();
  const stopSuburb = stop.stop_suburb.toLowerCase();
  const queryWords = query.split(/\s+/);
  
  let score = 0;
  
  queryWords.forEach(queryWord => {
    // Exact match in stop name (highest score)
    if (stopName === queryWord) {
      score += 100;
    }
    // Exact word match in stop name
    else if (stopName.split(/[\s\/\-]+/).includes(queryWord)) {
      score += 50;
    }
    // Partial match in stop name (starts with query)
    else if (stopName.startsWith(queryWord)) {
      score += 30;
    }
    // Partial match anywhere in stop name
    else if (stopName.includes(queryWord)) {
      score += 20;
    }
    // Exact word match in suburb
    else if (stopSuburb.split(/[\s\/\-]+/).includes(queryWord)) {
      score += 15;
    }
    // Partial match in suburb
    else if (stopSuburb.includes(queryWord)) {
      score += 10;
    }
  });
  
  return score;
}

/**
 * Mock departures data - mimics real PTV API behavior
 * Routes are determined by stop location and transport type
 */
function getMockDeparturesData(stopId: number): any {
  // Get the stop info to determine what routes serve it
  const stop = getStopById(stopId);
  if (!stop) {
    return { departures: [] };
  }

  // Get routes that actually serve this stop
  const routes = getRoutesByStop(stopId, stop.route_type);
  
  // Generate departures for each route (like real PTV API)
  const mockDepartures = routes.flatMap(route => 
    generateDeparturesForRoute(route, stopId)
  );

  return { departures: mockDepartures };
}

/**
 * Get stop info by ID (simulates PTV stops database)
 */
function getStopById(stopId: number): any {
  const allStops = getMockStopsData(""); // Your existing stops array
  return allStops.stops.find((stop: any) => stop.stop_id === stopId);
}

/**
 * Get routes that serve a specific stop (mimics real PTV route assignments)
 */
function getRoutesByStop(stopId: number, routeType: number) {
  // TRAIN STATIONS (route_type: 0)
  if (routeType === 0) {
    const trainRoutes = {
      1071: [ // Flinders Street Station
        { route_id: 1, route_name: "Cranbourne", direction_id: 1, direction_name: "Cranbourne" },
        { route_id: 2, route_name: "Pakenham", direction_id: 2, direction_name: "Pakenham" },
        { route_id: 3, route_name: "Frankston", direction_id: 3, direction_name: "Frankston" },
        { route_id: 4, route_name: "Sandringham", direction_id: 4, direction_name: "Sandringham" },
      ],
      3891: [ // Melbourne Central Station
        { route_id: 5, route_name: "Upfield", direction_id: 5, direction_name: "Upfield" },
        { route_id: 6, route_name: "Craigieburn", direction_id: 6, direction_name: "Craigieburn" },
        { route_id: 1, route_name: "Cranbourne", direction_id: 11, direction_name: "City Loop" },
        { route_id: 2, route_name: "Pakenham", direction_id: 12, direction_name: "City Loop" },
      ],
      4521: [ // Southern Cross Station
        { route_id: 7, route_name: "Werribee", direction_id: 7, direction_name: "Werribee" },
        { route_id: 8, route_name: "Williamstown", direction_id: 8, direction_name: "Williamstown" },
        { route_id: 9, route_name: "Sunbury", direction_id: 9, direction_name: "Sunbury" },
      ],
      5123: [ // Parliament Station
        { route_id: 10, route_name: "Hurstbridge", direction_id: 10, direction_name: "Hurstbridge" },
        { route_id: 11, route_name: "Mernda", direction_id: 11, direction_name: "Mernda" },
      ],
      1155: [ // Flagstaff Station
        { route_id: 1, route_name: "Cranbourne", direction_id: 11, direction_name: "City Loop" },
        { route_id: 5, route_name: "Upfield", direction_id: 15, direction_name: "City Loop" },
      ],
      9001: [ // Richmond Station
        { route_id: 1, route_name: "Cranbourne", direction_id: 1, direction_name: "Cranbourne" },
        { route_id: 2, route_name: "Pakenham", direction_id: 2, direction_name: "Pakenham" },
        { route_id: 3, route_name: "Frankston", direction_id: 3, direction_name: "Frankston" },
      ],
      9012: [ // South Yarra Station
        { route_id: 1, route_name: "Cranbourne", direction_id: 1, direction_name: "Cranbourne" },
        { route_id: 2, route_name: "Pakenham", direction_id: 2, direction_name: "Pakenham" },
        { route_id: 3, route_name: "Frankston", direction_id: 3, direction_name: "Frankston" },
        { route_id: 4, route_name: "Sandringham", direction_id: 4, direction_name: "Sandringham" },
      ],
    };
    return trainRoutes[stopId] ?? [];
  }

  // TRAM STOPS (route_type: 1)
  if (routeType === 1) {
    // Collins Street trams
    if ([2534, 2710, 2855, 2901, 2455].includes(stopId)) {
      return [
        { route_id: 11, route_name: "11", direction_id: 21, direction_name: "West Preston" },
        { route_id: 12, route_name: "12", direction_id: 22, direction_name: "St Kilda" },
        { route_id: 48, route_name: "48", direction_id: 48, direction_name: "North Balwyn" },
      ];
    }
    
    // Bourke Street trams
    if ([3001, 3012, 3024, 3035, 3046].includes(stopId)) {
      return [
        { route_id: 86, route_name: "86", direction_id: 86, direction_name: "Bundoora" },
        { route_id: 96, route_name: "96", direction_id: 96, direction_name: "East Brunswick" },
      ];
    }
    
    // Swanston Street trams
    if ([5001, 5012, 5023, 4012].includes(stopId)) {
      return [
        { route_id: 1, route_name: "1", direction_id: 101, direction_name: "East Coburg" },
        { route_id: 3, route_name: "3", direction_id: 103, direction_name: "Melbourne University" },
        { route_id: 5, route_name: "5", direction_id: 105, direction_name: "Malvern" },
        { route_id: 6, route_name: "6", direction_id: 106, direction_name: "Glen Iris" },
      ];
    }
    
    // Flinders Street trams
    if ([6234, 6245, 6256, 6267].includes(stopId)) {
      return [
        { route_id: 70, route_name: "70", direction_id: 170, direction_name: "Wattle Park" },
        { route_id: 75, route_name: "75", direction_id: 175, direction_name: "Vermont South" },
      ];
    }
    
    // La Trobe Street trams
    if ([4001, 4023, 4034].includes(stopId)) {
      return [
        { route_id: 30, route_name: "30", direction_id: 130, direction_name: "St Vincent's Plaza" },
        { route_id: 35, route_name: "35", direction_id: 135, direction_name: "City Circle" },
      ];
    }
    
    // St Kilda Road trams
    if ([5034].includes(stopId)) {
      return [
        { route_id: 58, route_name: "58", direction_id: 158, direction_name: "Toorak" },
        { route_id: 8, route_name: "8", direction_id: 108, direction_name: "Toorak" },
      ];
    }
    
    // Special destinations
    if (stopId === 8001) { // Crown Casino
      return [
        { route_id: 96, route_name: "96", direction_id: 196, direction_name: "St Kilda" },
        { route_id: 109, route_name: "109", direction_id: 209, direction_name: "Port Melbourne" },
      ];
    }
    
    if ([8012].includes(stopId)) { // Docklands
      return [
        { route_id: 31, route_name: "31", direction_id: 131, direction_name: "Docklands" },
        { route_id: 70, route_name: "70", direction_id: 270, direction_name: "Waterfront City" },
      ];
    }
    
    if (stopId === 8034) { // Royal Melbourne Hospital
      return [
        { route_id: 19, route_name: "19", direction_id: 119, direction_name: "North Coburg" },
        { route_id: 57, route_name: "57", direction_id: 157, direction_name: "West Maribyrnong" },
      ];
    }
  }

  // BUS STOPS (route_type: 2)
  if (routeType === 2) {
    const busRoutes = {
      7001: [ // QV Centre
        { route_id: 200, route_name: "200", direction_id: 300, direction_name: "Mickelham" },
        { route_id: 216, route_name: "216", direction_id: 316, direction_name: "Essendon" },
      ],
      7012: [ // Flagstaff Gardens
        { route_id: 235, route_name: "235", direction_id: 335, direction_name: "Fishermans Bend" },
        { route_id: 250, route_name: "250", direction_id: 350, direction_name: "Citylink" },
      ],
      7023: [ // St Pauls Cathedral
        { route_id: 246, route_name: "246", direction_id: 346, direction_name: "Clifton Hill" },
        { route_id: 605, route_name: "605", direction_id: 705, direction_name: "Gardenvale" },
      ],
      7034: [ // Queen Victoria Market
        { route_id: 546, route_name: "546", direction_id: 646, direction_name: "Elsternwick" },
        { route_id: 250, route_name: "250", direction_id: 350, direction_name: "Citylink" },
      ],
      8023: [ // Melbourne Central Shopping Centre
        { route_id: 302, route_name: "302", direction_id: 402, direction_name: "Airport West" },
        { route_id: 318, route_name: "318", direction_id: 418, direction_name: "Glenroy" },
      ],
    };
    return busRoutes[stopId] ?? [];
  }

  return [];
}

/**
 * Generate realistic departures for a specific route
 */
function generateDeparturesForRoute(route: any, stopId: number) {
  // Generate 2-3 departures per route (like real PTV API during peak times)
  const departureTimes = [5, 12, 19]; // 5, 12, 19 minutes from now
  
  return departureTimes.map((minutes, index) => {
    // Some trains/trams are delayed, others on time
    const isDelayed = (route.route_id + stopId + index) % 4 === 0; // Deterministic "randomness"
    const delayMinutes = isDelayed ? 2 : 0;
    
    const scheduledTime = new Date(Date.now() + minutes * 60000);
    const estimatedTime = isDelayed 
      ? new Date(Date.now() + (minutes + delayMinutes) * 60000)
      : null; // null means on time
    
    return {
      route_id: route.route_id,
      route_name: route.route_name,
      direction_id: route.direction_id,
      direction_name: route.direction_name,
      scheduled_departure_utc: scheduledTime.toISOString(),
      estimated_departure_utc: estimatedTime?.toISOString() ?? null,
      platform_number: route.route_id <= 11 ? (((route.route_id + index) % 4) + 1).toString() : null, // Trains have platforms
      flags: isDelayed ? ["RR"] : [], // RR = Road Repair (common delay reason)
    };
  });
}