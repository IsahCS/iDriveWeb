import { AxiosError } from "axios";

export interface PlaceResult {
  address_components: google.maps.GeocoderAddressComponent[];
  formatted_address: string;
  geometry: google.maps.GeocoderGeometry;
  icon: string;
  id: string;
  name: string;
  place_id: string;
  reference: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
}

export interface DriverOption {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  value: string;
}

export interface ConfirmRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  }
  value: string;
}

export interface EstimateResponse {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  distance: number;
  duration: string;
  options: DriverOption[];
  routeResponse: {
    routes: {
      legs: {
        startLocation: { latLng: { latitude: number; longitude: number } };
        endLocation: { latLng: { latitude: number; longitude: number } };
      }[];
      distanceMeters: number;
      duration: string;
    }[];
  };
}

export interface Ride {
  id: string;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

export interface Driver {
  id: string;
  name: string;
}

export interface CustomAxiosError extends AxiosError {
  response: {
    status: number;
    statusText: string;
    headers: any;
    config: any;
    data: {
      error_description?: string;
      error_message?: string;
      error?: string;
    };
  };
}

export interface Errors {
  customerId: boolean;
}