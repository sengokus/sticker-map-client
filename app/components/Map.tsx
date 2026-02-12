"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngBounds, LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import StickerMarkers from "./StickerMarkers";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 19,
};

const markerIconPng = "https://pbs.twimg.com/media/E9opYWXUUAcBVTv.jpg";
const customIcon = new Icon({
  iconUrl: markerIconPng,
  // shadowUrl: 'path/to/your/marker-shadow.png', // Optional shadow
  iconSize: [90, 95], // Size of the icon
  // shadowSize: [50, 64], // Size of the shadow
  iconAnchor: [22, 94], // Point of the icon which corresponds to marker's location
  // shadowAnchor: [4, 62], // The same for the shadow
  popupAnchor: [-3, -76], // Point from which the popup should open relative to the iconAnchora
});

const Map = ({ zoom = defaults.zoom, posix }: MapProps) => {
  return (
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
      {/* icon attribute is for displaying the image */}
      <Marker position={posix} draggable={false} icon={customIcon}>
        <Popup>Hey, I’m a popup!</Popup>
      </Marker>

      <StickerMarkers />
    </MapContainer>
  );
};

export default Map;
