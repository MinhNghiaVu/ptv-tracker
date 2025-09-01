import type { StopInterface } from "./stop.interface";

export interface RouteInterface {
  route_id: number;
  route_name: string;
  route_type: number;
  stops: StopInterface[];
};
