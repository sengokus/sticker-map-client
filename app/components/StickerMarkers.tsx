import { useMapEvents, Marker } from "react-leaflet";
import { useState } from "react";
import { log } from "console";

const StickerMarkers = () => {
  const [stickers, setStickers] = useState([]);
  useMapEvents({
    click(e) {
      const newStickerCoords = e.latlng;
      console.log(newStickerCoords);
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
