import type { PtvStatus } from "./ptvStatus.interface";

export interface PtvDeparturesResponse {
  departures?: PtvDeparture[];
  status?: PtvStatus;
}

export interface PtvDeparture {
  stop_id?: number;
  route_id?: number;
  run_id?: number;
  run_ref?: string;
  direction_id?: number;
  disruption_ids?: number[];
  scheduled_departure_utc?: string;
  estimated_departure_utc?: string;
  at_platform?: boolean;
  platform_number?: string;
  flags?: string;
  departure_sequence?: number;
  departure_note?: string;
}
