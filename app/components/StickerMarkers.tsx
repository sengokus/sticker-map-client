import { useMapEvents } from "react-leaflet";

interface StickerMarkerProps {
  // function to place a sticker on the map, accepting latitude and longitude as parameters
  placeSticker: (lat: number, lng: number) => void;
}

const StickerMarkers = ({ placeSticker }: StickerMarkerProps) => {
  useMapEvents({
    click(e) {
      const newStickerCoords = e.latlng;
      placeSticker(newStickerCoords.lat, newStickerCoords.lng);
    },
  });

  return null;
};

export default StickerMarkers;
