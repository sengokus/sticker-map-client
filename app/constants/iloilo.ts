import { LatLngBounds } from "leaflet";

// Iloilo City geographic bounds
export const ILOILO_BOUNDS = {
  // based on city GeoJSON extent with a small buffer
  minLat: 10.62,
  maxLat: 10.79,
  minLng: 122.47,
  maxLng: 122.63,
} as const;

export const iloiloCityBounds = new LatLngBounds(
  [ILOILO_BOUNDS.minLat, ILOILO_BOUNDS.minLng],
  [ILOILO_BOUNDS.maxLat, ILOILO_BOUNDS.maxLng],
);

export const ILOILO_BBOX = `${ILOILO_BOUNDS.minLng},${ILOILO_BOUNDS.minLat},${ILOILO_BOUNDS.maxLng},${ILOILO_BOUNDS.maxLat}`;
