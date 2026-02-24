import { Icon } from "leaflet";
import { StickerType, StickerTypes } from "../types/stickerTypes";

const validTypes = new Set(StickerTypes.map((s) => s.key));

export function createIcon(type: string): Icon {
  const safeType = validTypes.has(type as StickerType)
    ? (type as StickerType)
    : StickerTypes[0].key;
  const iconUrl = `/${safeType}.png`;
  return new Icon({
    iconUrl,
    iconSize: [100, 100],
    iconAnchor: [50, 50],
    popupAnchor: [-3, -76],
  });
}
