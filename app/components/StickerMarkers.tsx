import { useMapEvents, Marker } from "react-leaflet";
import { LatLng } from "leaflet";
import { useState } from "react";

const StickerMarkers = () => {
  const [stickers, setStickers] = useState<LatLng[]>([]);
  useMapEvents({
    click(e) {
      const newStickerCoords = e.latlng;
      setStickers((prevStickers) => [...prevStickers, newStickerCoords]);
    },
  });

  return (
    <>
      {stickers.map((position, idx) => (
        <Marker key={`marker-${idx}`} position={position}></Marker>
      ))}
    </>
  );
};

export default StickerMarkers;
