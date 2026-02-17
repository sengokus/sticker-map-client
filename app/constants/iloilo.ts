import { LatLngBounds } from "leaflet";

// Iloilo City geographic bounds
export const ILOILO_BOUNDS = {
  minLat: 10.68,
  maxLat: 10.78,
  minLng: 122.5,
  maxLng: 122.62,
} as const;

export const iloiloCityBounds = new LatLngBounds(
  [ILOILO_BOUNDS.minLat, ILOILO_BOUNDS.minLng],
  [ILOILO_BOUNDS.maxLat, ILOILO_BOUNDS.maxLng],
);

export const ILOILO_BBOX = `${ILOILO_BOUNDS.minLng},${ILOILO_BOUNDS.minLat},${ILOILO_BOUNDS.maxLng},${ILOILO_BOUNDS.maxLat}`;
