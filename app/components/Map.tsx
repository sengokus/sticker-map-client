"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon, LatLngExpression, LatLngTuple, LatLngBounds } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import StickerMarkers from "./StickerMarkers";
import StickerSelector from "./StickerSelector";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

export const StickerTypes = [
  { key: "family-food-space", label: "Family Food Space" },
  { key: "food-space-for-friends", label: "Food Space for Friends" },
  { key: "food-space-for-tourists", label: "Food Space for Tourists" },
  { key: "food-space-needs-work", label: "Food Space Needs Work" },
  { key: "food-space-that-i-love", label: "Food Space That I Love" },
  { key: "food-space-w-potential", label: "Food Space with Potential" },
  { key: "food-w-a-view", label: "Food with a View" },
  { key: "heritage-food-space", label: "Heritage Food Space" },
  { key: "inherited-flavors", label: "Inherited Flavors" },
  { key: "market-and-plaza-eats", label: "Market and Plaza Eats" },
  { key: "spaces-w-food-on-the-go", label: "Spaces with Food on the Go" },
  { key: "truly-ilonggo", label: "Truly Ilonggo" },
] as const;

export type StickerType = (typeof StickerTypes)[number]["key"];

export interface PlacedSticker {
  lat: number;
  lng: number;
  type: StickerType;
}

const defaults = {
  zoom: 19,
};

// Iloilo City bounds
const iloiloCityBounds = new LatLngBounds([10.68, 122.5], [10.78, 122.62]);

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
  const [selectedStickerType, setSelectedStickerType] = useState<StickerType>(
    StickerTypes[0].key,
  );

  // function to handle map clicks and place a new sticker based on the selected type, passed to StickerMarkers component
  const handleMapClick = (lat: number, lng: number) => {
    if (!iloiloCityBounds.contains([lat, lng])) {
      toast.warn("Stickers can only be placed within Iloilo City bounds.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: { width: "330px" },
      });
      return;
    }

    const newSticker: PlacedSticker = {
      lat,
      lng,
      type: selectedStickerType,
    };

    setStickers((prevStickers) => [...prevStickers, newSticker]);
  };

  // function to undo the last placed sticker
  const handleUndo = () => {
    setStickers((prevStickers) => prevStickers.slice(0, -1));
  };

  // function to handle submit
  const handleSubmit = () => {
    // on click here would be the post request
    console.log(
      "Stickers submitted:",
      stickers.map((sticker) => ({
        coordinates: [sticker.lat, sticker.lng],
        type: sticker.type,
      })),
    );
  };

  return (
    <div className="flex flex-col h-screen relative">
      <div className="relative flex-1">
        <StickerSelector
          stickers={stickers}
          selectedStickerType={selectedStickerType}
          onSelectSticker={setSelectedStickerType}
          onUndo={handleUndo}
          canUndo={stickers.length > 0}
          onSubmit={handleSubmit}
        />
        <MapContainer
          attributionControl={false}
          center={posix}
          zoom={zoom}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          maxBounds={iloiloCityBounds}
          maxBoundsViscosity={1.0}
          minZoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stickers.map((placedSticker, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={[placedSticker.lat, placedSticker.lng]}
              icon={createIcon(placedSticker.type)}
            ></Marker>
          ))}

          <StickerMarkers placeSticker={handleMapClick} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
