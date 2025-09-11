import type { PtvStatus } from "./ptvStatus.interface";

export interface PtvSearchResult {
  stops?: PtvResultStop[];
  routes?: PtvResultRoute[];
  outlets?: PtvResultOutlet[];
  status?: PtvStatus;
}

export interface PtvResultStop {
  stop_distance?: number;
  stop_suburb?: string;
  route_type?: number;
  routes?: PtvResultRoute[];
  stop_latitude?: number;
  stop_longitude?: number;
  stop_sequence?: number;
  stop_id?: number;
  stop_name?: string;
  stop_landmark?: string;
}

export interface PtvResultRoute {
  route_name?: string;
  route_number?: string;
  route_type?: number;
  route_id?: number;
  route_gtfs_id?: string;
  route_service_status?: PtvRouteServiceStatus;
}

export interface PtvResultOutlet {
  outlet_distance?: number;
  outlet_slid_spid?: string;
  outlet_name?: string;
  outlet_business?: string;
  outlet_latitude?: number;
  outlet_longitude?: number;
  outlet_suburb?: string;
  outlet_postcode?: number;
  outlet_business_hour_mon?: string;
  outlet_business_hour_tue?: string;
  outlet_business_hour_wed?: string;
  outlet_business_hour_thur?: string;
  outlet_business_hour_fri?: string;
  outlet_business_hour_sat?: string;
  outlet_business_hour_sun?: string;
  outlet_notes?: string;
}

export interface PtvRouteServiceStatus {
  description?: string;
  timestamp?: string;
}