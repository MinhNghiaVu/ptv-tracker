import type { Stop } from "./stop.interface";
import type { Departure } from "./departure.interface";

export interface IResponse<T> {
  success: boolean;
  message?: string;
  data?: T
};

export interface StopsResponse {
  stops: Stop[];
  totalCount: number
}

export interface DeparturesResponse {
  departures: Departure[];
  totalCount: number;
}
