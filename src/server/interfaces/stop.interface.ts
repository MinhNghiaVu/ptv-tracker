export interface Stop {
  stop_id: number;
  stop_name: string;
  stop_suburb: string;
  route_type: number;
  stop_latitude: number;
  stop_longitude: number;
};

export interface ProcessedStop {
  id: number;
  name: string;
  suburb: string | null;
  routeType: number;
  latitude: number;
  longitude: number;
}