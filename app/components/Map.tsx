"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon, LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import StickerMarkers from "./StickerMarkers";
import StickerSelector from "./StickerSelector";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import {
  StickerTypes,
  StickerType,
  PlacedSticker,
} from "../types/stickerTypes";
import SearchField from "./SearchField";
import { iloiloCityBounds } from "../constants/iloilo";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  username?: string;
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

const Map = ({ zoom = defaults.zoom, posix, username }: MapProps) => {
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerType, setSelectedStickerType] = useState<StickerType>(
    StickerTypes[0].key,
  );

  // function to handle map clicks and place a new sticker based on the selected type, passed to StickerMarkers component
  const handleMapClick = (lat: number, lng: number) => {
    if (!iloiloCityBounds.contains([lat, lng])) {
      toast.warn("Stickers can only be placed within Iloilo City bounds.", {
        toastId: "bounds-warning",
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
  const handleSubmit = async () => {

    const payload = stickers.map((sticker) => ({
      lat: sticker.lat,
      lng: sticker.lng,
      sticker_type: sticker.type,
      name: username
    }));

    // on click here would be the post request
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/locations`,{
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({stickers:payload })
    })

    

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

          <SearchField />

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
