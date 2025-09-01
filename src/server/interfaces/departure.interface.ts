export interface Departure {
  route_id: number;
  route_name: string;
  direction_name: string;
  scheduled_departure_utc: string;
  estimated_departure_utc: string;
  platform_number: string;
};
