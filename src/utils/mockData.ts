// ==============================
// MOCK DATA
// ==============================

function getMockStopsData(query: string): { stops: Stop[] } {
  const allMockStops: Stop[] = [
    // TRAIN STATIONS
    {
      stop_id: 1071,
      stop_name: "Flinders Street Station",
      stop_suburb: "Melbourne",
      route_type: 0,
      stop_latitude: -37.8183,
      stop_longitude: 144.9671,
    },
    {
      stop_id: 3891,
      stop_name: "Melbourne Central Station",
      stop_suburb: "Melbourne",
      route_type: 0,
      stop_latitude: -37.8098,
      stop_longitude: 144.9633,
    },
    {
      stop_id: 4521,
      stop_name: "Southern Cross Station",
      stop_suburb: "Melbourne",
      route_type: 0,
      stop_latitude: -37.8184,
      stop_longitude: 144.9525,
    },
    {
      stop_id: 5123,
      stop_name: "Parliament Station",
      stop_suburb: "Melbourne",
      route_type: 0,
      stop_latitude: -37.8112,
      stop_longitude: 144.9742,
    },
    {
      stop_id: 1155,
      stop_name: "Flagstaff Station",
      stop_suburb: "Melbourne",
      route_type: 0,
      stop_latitude: -37.8120,
      stop_longitude: 144.9569,
    },

    // TRAM STOPS - Collins Street
    {
      stop_id: 2534,
      stop_name: "Collins St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8136,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 2710,
      stop_name: "Collins St/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8142,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 2855,
      stop_name: "Collins St/King St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8166,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 2901,
      stop_name: "Collins St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8170,
      stop_longitude: 144.9531,
    },
    {
      stop_id: 2455,
      stop_name: "Collins St/Russell St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8134,
      stop_longitude: 144.9692,
    },

    // TRAM STOPS - Bourke Street
    {
      stop_id: 3001,
      stop_name: "Bourke St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8143,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 3012,
      stop_name: "Bourke St/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8149,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 3024,
      stop_name: "Bourke St/King St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8173,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 3035,
      stop_name: "Bourke St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8177,
      stop_longitude: 144.9531,
    },
    {
      stop_id: 3046,
      stop_name: "Bourke St/Russell St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8141,
      stop_longitude: 144.9692,
    },

    // TRAM STOPS - Flinders Street
    {
      stop_id: 6234,
      stop_name: "Federation Square/Flinders St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8175,
      stop_longitude: 144.9692,
    },
    {
      stop_id: 6245,
      stop_name: "Flinders St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8183,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 6256,
      stop_name: "Flinders St/King St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8186,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 6267,
      stop_name: "Flinders St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8190,
      stop_longitude: 144.9531,
    },

    // TRAM STOPS - La Trobe Street
    {
      stop_id: 4001,
      stop_name: "La Trobe St/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8102,
      stop_longitude: 144.9631,
    },
    {
      stop_id: 4012,
      stop_name: "La Trobe St/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8108,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 4023,
      stop_name: "La Trobe St/King St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8131,
      stop_longitude: 144.9556,
    },
    {
      stop_id: 4034,
      stop_name: "La Trobe St/Spencer St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8135,
      stop_longitude: 144.9531,
    },

    // TRAM STOPS - Swanston Street
    {
      stop_id: 5001,
      stop_name: "Melbourne University/Swanston St",
      stop_suburb: "Parkville",
      route_type: 1,
      stop_latitude: -37.7991,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 5012,
      stop_name: "RMIT/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8076,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 5023,
      stop_name: "Melbourne Town Hall/Swanston St",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8149,
      stop_longitude: 144.9665,
    },
    {
      stop_id: 5034,
      stop_name: "Arts Centre/St Kilda Rd",
      stop_suburb: "Melbourne",
      route_type: 1,
      stop_latitude: -37.8216,
      stop_longitude: 144.9685,
    },

    // BUS STOPS - Major ones in CBD
    {
      stop_id: 7001,
      stop_name: "QV Centre/Lonsdale St",
      stop_suburb: "Melbourne",
      route_type: 2,
      stop_latitude: -37.8116,
      stop_longitude: 144.9642,
    },
    {
      stop_id: 7012,
      stop_name: "Flagstaff Gardens/William St",
      stop_suburb: "Melbourne",
      route_type: 2,
      stop_latitude: -37.8123,
      stop_longitude: 144.9547,
    },
    {
      stop_id: 7023,
      stop_name: "St Pauls Cathedral/Flinders St",
      stop_suburb: "Melbourne",
      route_type: 2,
      stop_latitude: -37.8171,
      stop_longitude: 144.9673,
    },
    {
      stop_id: 7034,
      stop_name: "Queen Victoria Market/Elizabeth St",
      stop_suburb: "Melbourne",
      route_type: 2,
      stop_latitude: -37.8076,
      stop_longitude: 144.9571,
    },

    // POPULAR DESTINATIONS
    {
      stop_id: 8001,
      stop_name: "Crown Casino/Southbank",
      stop_suburb: "Southbank",
      route_type: 1,
      stop_latitude: -37.8266,
      stop_longitude: 144.9588,
    },
    {
      stop_id: 8012,
      stop_name: "Docklands Drive/Harbour Esplanade",
      stop_suburb: "Docklands",
      route_type: 1,
      stop_latitude: -37.8168,
      stop_longitude: 144.9459,
    },
    {
      stop_id: 8023,
      stop_name: "Melbourne Central Shopping Centre",
      stop_suburb: "Melbourne",
      route_type: 2,
      stop_latitude: -37.8098,
      stop_longitude: 144.9633,
    },
    {
      stop_id: 8034,
      stop_name: "Royal Melbourne Hospital",
      stop_suburb: "Parkville",
      route_type: 1,
      stop_latitude: -37.7994,
      stop_longitude: 144.9561,
    },

    // INNER CITY AREAS
    {
      stop_id: 9001,
      stop_name: "Richmond Station",
      stop_suburb: "Richmond",
      route_type: 0,
      stop_latitude: -37.8268,
      stop_longitude: 144.9888,
    },
    {
      stop_id: 9012,
      stop_name: "South Yarra Station",
      stop_suburb: "South Yarra",
      route_type: 0,
      stop_latitude: -37.8404,
      stop_longitude: 144.9888,
    },
    {
      stop_id: 9023,
      stop_name: "Prahran Station",
      stop_suburb: "Prahran",
      route_type: 0,
      stop_latitude: -37.8505,
      stop_longitude: 144.9888,
    },
    {
      stop_id: 9034,
      stop_name: "Windsor Station",
      stop_suburb: "Windsor",
      route_type: 0,
      stop_latitude: -37.8575,
      stop_longitude: 144.9888,
    },
  ];

  const queryLower = query.toLowerCase().trim();

  if (queryLower.length < 1) {
    return { stops: allMockStops };
  }

  const searchResults = allMockStops
    .map(stop => ({
      stop,
      score: calculateSearchScore(stop, queryLower),
    }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.stop);

  logger.info(`[PTV_SERVICE] Mock data: ${searchResults.length} stops found for "${query}"`);
  return { stops: searchResults };
}

function calculateSearchScore(stop: Stop, query: string): number {
  const stopName = stop.stop_name.toLowerCase();
  const stopSuburb = stop.stop_suburb.toLowerCase();
  const queryWords = query.split(/\s+/);
  
  let score = 0;
  
  queryWords.forEach(queryWord => {
    if (stopName === queryWord) {
      score += 100;
    } else if (stopName.split(/[\s\/\-]+/).includes(queryWord)) {
      score += 50;
    } else if (stopName.startsWith(queryWord)) {
      score += 30;
    } else if (stopName.includes(queryWord)) {
      score += 20;
    } else if (stopSuburb.split(/[\s\/\-]+/).includes(queryWord)) {
      score += 15;
    } else if (stopSuburb.includes(queryWord)) {
      score += 10;
    }
  });
  
  return score;
}

function getMockDeparturesData(stopId: number, routeType?: number): { departures: Departure[] } {
  const stop = getStopById(stopId);
  if (!stop) {
    return { departures: [] };
  }

  const routes = getRoutesByStop(stopId, routeType);
  const mockDepartures = routes.flatMap(route => 
    generateDeparturesForRoute(route, stopId)
  );

  return { departures: mockDepartures };
}

function getStopById(stopId: number): Stop | undefined {
  const allStopsResponse = getMockStopsData("");
  return allStopsResponse.stops.find(stop => stop.stop_id === stopId);
}

function getRoutesByStop(stopId: number, routeType?: number): Route[] {
  // TRAIN STATIONS (route_type: 0)
  if (routeType === 0) {
    const trainRoutes: Record<number, Route[]> = {
      1071: [ // Flinders Street Station
        { route_id: 1, route_name: "Cranbourne", route_type: 0, stops: [] },
        { route_id: 2, route_name: "Pakenham", route_type: 0, stops: [] },
        { route_id: 3, route_name: "Frankston", route_type: 0, stops: [] },
        { route_id: 4, route_name: "Sandringham", route_type: 0, stops: [] },
      ],
      3891: [ // Melbourne Central Station
        { route_id: 5, route_name: "Upfield", route_type: 0, stops: [] },
        { route_id: 6, route_name: "Craigieburn", route_type: 0, stops: [] },
        { route_id: 1, route_name: "Cranbourne", route_type: 0, stops: [] },
        { route_id: 2, route_name: "Pakenham", route_type: 0, stops: [] },
      ],
      4521: [ // Southern Cross Station
        { route_id: 7, route_name: "Werribee", route_type: 0, stops: [] },
        { route_id: 8, route_name: "Williamstown", route_type: 0, stops: [] },
        { route_id: 9, route_name: "Sunbury", route_type: 0, stops: [] },
      ],
      5123: [ // Parliament Station
        { route_id: 10, route_name: "Hurstbridge", route_type: 0, stops: [] },
        { route_id: 11, route_name: "Mernda", route_type: 0, stops: [] },
      ],
      1155: [ // Flagstaff Station
        { route_id: 1, route_name: "Cranbourne", route_type: 0, stops: [] },
        { route_id: 5, route_name: "Upfield", route_type: 0, stops: [] },
      ],
      9001: [ // Richmond Station
        { route_id: 1, route_name: "Cranbourne", route_type: 0, stops: [] },
        { route_id: 2, route_name: "Pakenham", route_type: 0, stops: [] },
        { route_id: 3, route_name: "Frankston", route_type: 0, stops: [] },
      ],
      9012: [ // South Yarra Station
        { route_id: 1, route_name: "Cranbourne", route_type: 0, stops: [] },
        { route_id: 2, route_name: "Pakenham", route_type: 0, stops: [] },
        { route_id: 3, route_name: "Frankston", route_type: 0, stops: [] },
        { route_id: 4, route_name: "Sandringham", route_type: 0, stops: [] },
      ],
    };
    return trainRoutes[stopId] ?? [];
  }

  // TRAM STOPS (route_type: 1)
  if (routeType === 1) {
    // Collins Street trams
    if ([2534, 2710, 2855, 2901, 2455].includes(stopId)) {
      return [
        { route_id: 11, route_name: "11", route_type: 1, stops: [] },
        { route_id: 12, route_name: "12", route_type: 1, stops: [] },
        { route_id: 48, route_name: "48", route_type: 1, stops: [] },
      ];
    }
    
    // Bourke Street trams
    if ([3001, 3012, 3024, 3035, 3046].includes(stopId)) {
      return [
        { route_id: 86, route_name: "86", route_type: 1, stops: [] },
        { route_id: 96, route_name: "96", route_type: 1, stops: [] },
      ];
    }
    
    // Swanston Street trams
    if ([5001, 5012, 5023, 4012].includes(stopId)) {
      return [
        { route_id: 1, route_name: "1", route_type: 1, stops: [] },
        { route_id: 3, route_name: "3", route_type: 1, stops: [] },
        { route_id: 5, route_name: "5", route_type: 1, stops: [] },
        { route_id: 6, route_name: "6", route_type: 1, stops: [] },
      ];
    }
    
    // Flinders Street trams
    if ([6234, 6245, 6256, 6267].includes(stopId)) {
      return [
        { route_id: 70, route_name: "70", route_type: 1, stops: [] },
        { route_id: 75, route_name: "75", route_type: 1, stops: [] },
      ];
    }
    
    // La Trobe Street trams
    if ([4001, 4023, 4034].includes(stopId)) {
      return [
        { route_id: 30, route_name: "30", route_type: 1, stops: [] },
        { route_id: 35, route_name: "35", route_type: 1, stops: [] },
      ];
    }
    
    // St Kilda Road trams
    if ([5034].includes(stopId)) {
      return [
        { route_id: 58, route_name: "58", route_type: 1, stops: [] },
        { route_id: 8, route_name: "8", route_type: 1, stops: [] },
      ];
    }
    
    // Special destinations
    if (stopId === 8001) { // Crown Casino
      return [
        { route_id: 96, route_name: "96", route_type: 1, stops: [] },
        { route_id: 109, route_name: "109", route_type: 1, stops: [] },
      ];
    }
    
    if ([8012].includes(stopId)) { // Docklands
      return [
        { route_id: 31, route_name: "31", route_type: 1, stops: [] },
        { route_id: 70, route_name: "70", route_type: 1, stops: [] },
      ];
    }
    
    if (stopId === 8034) { // Royal Melbourne Hospital
      return [
        { route_id: 19, route_name: "19", route_type: 1, stops: [] },
        { route_id: 57, route_name: "57", route_type: 1, stops: [] },
      ];
    }
  }

  // BUS STOPS (route_type: 2)
  if (routeType === 2) {
    const busRoutes: Record<number, Route[]> = {
      7001: [ // QV Centre
        { route_id: 200, route_name: "200", route_type: 2, stops: [] },
        { route_id: 216, route_name: "216", route_type: 2, stops: [] },
      ],
      7012: [ // Flagstaff Gardens
        { route_id: 235, route_name: "235", route_type: 2, stops: [] },
        { route_id: 250, route_name: "250", route_type: 2, stops: [] },
      ],
      7023: [ // St Pauls Cathedral
        { route_id: 246, route_name: "246", route_type: 2, stops: [] },
        { route_id: 605, route_name: "605", route_type: 2, stops: [] },
      ],
      7034: [ // Queen Victoria Market
        { route_id: 546, route_name: "546", route_type: 2, stops: [] },
        { route_id: 250, route_name: "250", route_type: 2, stops: [] },
      ],
      8023: [ // Melbourne Central Shopping Centre
        { route_id: 302, route_name: "302", route_type: 2, stops: [] },
        { route_id: 318, route_name: "318", route_type: 2, stops: [] },
      ],
    };
    return busRoutes[stopId] ?? [];
  }

  return [];
}

function generateDeparturesForRoute(route: Route, stopId: number): Departure[] {
  const departureTimes = [5, 12, 19]; // 5, 12, 19 minutes from now
  
  return departureTimes.map((minutes, index) => {
    const isDelayed = (route.route_id + stopId + index) % 4 === 0;
    const delayMinutes = isDelayed ? 2 : 0;
    
    const scheduledTime = new Date(Date.now() + minutes * 60000);
    const estimatedTime = isDelayed 
      ? new Date(Date.now() + (minutes + delayMinutes) * 60000)
      : scheduledTime; // Use scheduled time if not delayed
    
    return {
      route_id: route.route_id,
      route_name: route.route_name,
      direction_name: getDirectionName(route, stopId),
      scheduled_departure_utc: scheduledTime.toISOString(),
      estimated_departure_utc: estimatedTime.toISOString(),
      platform_number: route.route_id <= 11 ? (((route.route_id + index) % 4) + 1).toString() : "",
    };
  });
}

function getDirectionName(route: Route, stopId: number): string {
  // Simple direction mapping based on route and transport type
  const directions: Record<number, string> = {
    1: "Cranbourne",
    2: "Pakenham", 
    3: "Frankston",
    4: "Sandringham",
    5: "Upfield",
    6: "Craigieburn",
    7: "Werribee",
    8: "Williamstown",
    9: "Sunbury",
    10: "Hurstbridge",
    11: "Mernda",
    12: "St Kilda",
    48: "North Balwyn",
    86: "Bundoora",
    96: "East Brunswick",
    70: "Wattle Park",
    75: "Vermont South",
    30: "St Vincent's Plaza",
    35: "City Circle",
    58: "Toorak",
    19: "North Coburg",
    57: "West Maribyrnong",
    31: "Docklands",
    109: "Port Melbourne",
    200: "Mickelham",
    216: "Essendon",
    235: "Fishermans Bend",
    250: "Citylink",
    246: "Clifton Hill",
    605: "Gardenvale",
    546: "Elsternwick",
    302: "Airport West",
    318: "Glenroy",
  };
  
  // For CBD stops, many routes go "to City" vs "from City"
  const cbdStops = [1071, 3891, 4521, 5123, 1155]; // Major train stations
  const isCBDStop = cbdStops.includes(stopId);
  
  const baseDirection = directions[route.route_id] ?? "City";
  
  // If it's a CBD stop and we have a suburban route, it's likely going outbound
  if (isCBDStop && route.route_type === 0 && route.route_id <= 11) {
    return baseDirection; // e.g., "Cranbourne" (outbound)
  }
  
  // For suburban stops, trains usually go "to City"
  if (!isCBDStop && route.route_type === 0) {
    return "City Loop";
  }
  
  return baseDirection;
}