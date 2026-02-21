"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

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
import { createIcon } from "../lib/stickerIcon";
import { useSubmitResponse } from "../hooks/useSubmitResponse";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  username?: string;
  onSubmittedSuccess?: () => void;
}

export const mapDefaults = {
  zoom: 19,
  center: [10.7302, 122.5591] as LatLngTuple,
};

const Map = ({
  zoom = mapDefaults.zoom,
  posix = mapDefaults.center,
  username,
  onSubmittedSuccess,
}: MapProps) => {
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerType, setSelectedStickerType] = useState<StickerType>(
    StickerTypes[0].key,
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const submitResponse = useSubmitResponse();

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

  const handleConfirmSubmit = () => {
    const payload = {
      stickers: stickers.map((s) => ({
        lat: s.lat,
        lng: s.lng,
        sticker_type: s.type,
      })),
      ...(username && { username }),
    };

    submitResponse.mutate(payload, {
      onSuccess: (data) => {
        setShowConfirmDialog(false);
        onSubmittedSuccess?.();
        if (data.alreadyResponded) {
          return;
        }
        if (data.success) {
          toast.success(
            data.message ?? "Your response has been submitted successfully!",
            {
              toastId: "submit-success",
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              theme: "light",
              transition: Bounce,
            },
          );
        }
      },
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
          {
            toastId: "submit-error",
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            theme: "light",
            transition: Bounce,
          },
        );
      },
    });
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
        isSubmitting={submitResponse.isPending}
      />
    </div>
  );
};

export default Map;
