"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { iloiloCityBounds } from "../constants/iloilo";
import { createIcon } from "../lib/stickerIcon";
import type { AdminSticker } from "../types/admin";
import SearchField from "./SearchField";
import { mapDefaults } from "./Map";

interface AdminMapProps {
  stickers: AdminSticker[];
}

export default function AdminMap({ stickers }: AdminMapProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <MapContainer
        attributionControl={false}
        center={mapDefaults.center}
        zoom={mapDefaults.zoom}
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

        {stickers.map((sticker) => {
          const lat = sticker.lat ?? sticker.latitude ?? 0;
          const lng = sticker.lng ?? sticker.longitude ?? 0;
          if (!lat || !lng) return null;

          return (
            <Marker
              key={sticker.id}
              position={[lat, lng]}
              icon={createIcon(sticker.sticker_type)}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-medium">
                    {sticker.sticker_type.replace(/-/g, " ")}
                  </div>
                  {sticker.username && (
                    <div className="text-gray-600">{sticker.username}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
