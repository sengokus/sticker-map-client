import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/assets/css/leaflet.css";
import { useEffect } from "react";

type SearchFieldProps = {
  apiKey: string;
};

const SearchField = ({ apiKey }: SearchFieldProps) => {
  const provider = new MapBoxProvider({
    params: {
      access_token: apiKey,
    },
  });

  // @ts-ignore
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
