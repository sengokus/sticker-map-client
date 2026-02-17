"use client";

import { PlacedSticker, StickerType, StickerTypes } from "./Map";
import Image from "next/image";

interface StickerSelectorProps {
  stickers: PlacedSticker[];
  selectedStickerType: StickerType;
  onSelectSticker: (type: StickerType) => void;
  onUndo: () => void;
  canUndo: boolean;
  onSubmit: () => void;
}

const StickerSelector = ({
  stickers,
  selectedStickerType,
  onSelectSticker,
  onUndo,
  canUndo,
  onSubmit,
}: StickerSelectorProps) => {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg max-h-[35vh] max-w-[50vh] overflow-hidden flex flex-col">
      <div className="sticky top-0 bg-white z-10 p-4 pb-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-md font-bold text-[#48BF7E]">
            Select a sticker:
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                canUndo
                  ? "bg-[#48BF7E] hover:bg-[#48BF7E]/80 cursor-pointer"
                  : "bg-gray-300 hover:bg-gray-300/80 cursor-not-allowed opacity-50"
              }`}
              title="Undo"
            >
              <Image
                src="/icons/undo.svg"
                alt="Undo"
                width={20}
                height={20}
                className={canUndo ? "brightness-0 invert" : ""}
              />
            </button>
            <button
              onClick={onSubmit}
              disabled={stickers.length === 0}
              className="p-2 w-20 rounded-full transition-all flex items-center justify-center bg-[#48BF7E] hover:bg-[#48BF7E]/80 cursor-pointer text-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <div className="p-4 pt-3">
          <div className="grid sm:grid-cols-3 md:grid-cols-3 gap-4">
            {StickerTypes.map((sticker) => (
              <button
                key={sticker.key}
                onClick={() => onSelectSticker(sticker.key)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all hover:scale-105 ${
                  selectedStickerType === sticker.key
                    ? "bg-blue-100 ring-2 ring-blue-500"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Image
                  src={`/${sticker.key}.png`}
                  alt={sticker.label}
                  className="mb-2"
                  width={64}
                  height={64}
                />
                <span className="text-xs text-center text-gray-700 font-medium">
                  {sticker.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerSelector;
