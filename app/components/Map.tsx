"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon, LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import StickerMarkers from "./StickerMarkers";
import StickerSelector from "./StickerSelector";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import {
  StickerTypes,
  StickerType,
  PlacedSticker,
} from "../types/stickerTypes";
import SearchField from "./SearchField";
import { iloiloCityBounds } from "../constants/iloilo";
import { SUBMITTED_KEY } from "../constants/survey";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  username?: string;
  onSubmittedSuccess?: () => void;
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

const Map = ({
  zoom = defaults.zoom,
  posix,
  username,
  onSubmittedSuccess,
}: MapProps) => {
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerType, setSelectedStickerType] = useState<StickerType>(
    StickerTypes[0].key,
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // function to handle map clicks and place a new sticker based on the selected type, passed to StickerMarkers component
  const handleMapClick = (lat: number, lng: number) => {
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

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    const payload = stickers.map((sticker) => ({
      lat: sticker.lat,
      lng: sticker.lng,
      sticker_type: sticker.type,
      name: username,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/api/locations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stickers: payload }),
        },
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      localStorage.setItem(SUBMITTED_KEY, "true");
      setShowConfirmDialog(false);
      setIsSubmitting(false);
      onSubmittedSuccess?.();
      toast.success("Thank you! Your response has been submitted.", {
        toastId: "submit-success",
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
    } catch {
      setIsSubmitting(false);
      toast.error("Something went wrong. Please try again.", {
        toastId: "submit-error",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        theme: "light",
        transition: Bounce,
      });
    }
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

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Submit Response"
        subtitle="Are you sure you want to submit your response? You can only respond to this survey once."
        confirmLabel="Submit"
        cancelLabel="Cancel"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmDialog(false)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Map;
