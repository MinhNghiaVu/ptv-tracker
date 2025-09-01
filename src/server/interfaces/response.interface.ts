import type { StopInterface } from "./stop.interface";
import type { DepartureInterface } from "./departure.interface";

export interface IResponse<T> {
  success: boolean;
  message?: string;
  data?: T
};

export interface StopsResponse {
  stops: StopInterface[];
  totalCount: number
}

export interface DeparturesResponse {
  departures: DepartureInterface[];
  totalCount: number;
}
