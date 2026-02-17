"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon, LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import StickerMarkers from "./StickerMarkers";
import { useState } from "react";
import SearchField from "./SearchField";

if (!process.env.MAPBOX_API_KEY) {
  throw new Error(
    "Missing Mapbox API key. Please set NEXT_PUBLIC_MAPBOX_API_KEY in your environment variables.",
  );
}

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const StickerTypes = [
  "family-food-space",
  "food-space-for-friends",
  "food-space-for-tourists",
  "food-space-needs-work",
  "food-space-that-i-love",
  "food-space-w-potential",
  "food-w-a-view",
  "heritage-food-space",
  "inherited-flavors",
  "market-and-plaza-eats",
  "spaces-w-food-on-the-go",
  "truly-ilonggo",
] as const;

type StickerType = (typeof StickerTypes)[number];

interface PlacedSticker {
  lat: number;
  lng: number;
  type: StickerType;
}

const defaults = {
  zoom: 19,
};

// helper function to create a Leaflet icon based on the sticker type
const createIcon = (type: StickerType) => {
  const iconUrl = `/${type}.png`; // Assuming your sticker images are in the public/stickers directory
  return new Icon({
    iconUrl: iconUrl,
    // shadowUrl: 'path/to/your/marker-shadow.png', // Optional shadow
    iconSize: [100, 100], // Size of the icon
    // shadowSize: [50, 64], // Size of the shadow
    iconAnchor: [50, 50], // Point of the icon which corresponds to marker's location
    // shadowAnchor: [4, 62], // The same for the shadow
    popupAnchor: [-3, -76], // Point from which the popup should open relative to the iconAnchora
  });
};

const Map = ({ zoom = defaults.zoom, posix }: MapProps) => {
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerType, setSelectedStickerType] =
    useState<StickerType>("family-food-space");

  // function to handle map clicks and place a new sticker based on the selected type, passed to StickerMarkers component
  const handleMapClick = (lat: number, lng: number) => {
    const newSticker: PlacedSticker = {
      lat,
      lng,
      type: selectedStickerType,
    };

    setStickers((prevStickers) => [...prevStickers, newSticker]);
  };

  const apiKey = process.env.MAPBOX_API_KEY;
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 p-4 text-white">
        {/* temporary map for buttons */}
        {StickerTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedStickerType(type)}
            className={`mr-2 px-4 hover:cursor-pointer py-2 rounded ${selectedStickerType === type ? "bg-blue-500" : "bg-gray-600"}`}
          >
            Pick {type}
          </button>
        ))}
      </div>

      <MapContainer
        attributionControl={false}
        center={posix}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <SearchField apiKey={apiKey!} />

        {stickers.map((placedSticker, idx) => (
          <Marker
            key={`marker-${idx}`}
            position={[placedSticker.lat, placedSticker.lng]}
            icon={createIcon(placedSticker.type)}
          ></Marker>
        ))}

        <StickerMarkers placeSticker={handleMapClick} />
      </MapContainer>

      <button
        // on click here would be the post request
        onClick={() => console.log("Clicked")}
        className={`mr-2 px-4 py-2 rounded bg-blue-500 hover:cursor-pointer`}
      >
        Submit
      </button>
    </div>
  );
};

export default Map;
