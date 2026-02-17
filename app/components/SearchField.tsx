import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/assets/css/leaflet.css";
import { useEffect } from "react";
import { ILOILO_BBOX } from "../constants/iloilo";

const SearchField = () => {
  const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Mapbox API key. Please set NEXT_PUBLIC_MAPBOX_API_KEY in your environment variables.",
    );
  }

  const provider = new MapBoxProvider({
    searchUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
    params: {
      access_token: apiKey,
      bbox: ILOILO_BBOX,
    },
  });

  // @ts-expect-error - GeoSearchControl is not typed
  const searchControl = new GeoSearchControl({
    autoComplete: true, // optional: true|false  - default true
    autoCompleteDelay: 250,
    provider: provider,
    style: "bar", // optional: 'button' or 'bar' - default 'button'
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
  }, []);

  return null;
};

export default SearchField;
