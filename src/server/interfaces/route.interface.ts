import type { Stop } from "./stop.interface";

export interface Route {
  route_id: number;
  route_name: string;
  route_type: number;
  stops: Stop[];
};
