export const StickerTypes = [
  { key: "truly-ilonggo", label: "Truly Ilonggo" },
  { key: "food-space-that-i-love", label: "Food Space That I Love" },
  { key: "family-food-space", label: "Family Food Space" },
  { key: "food-space-for-friends", label: "Food Space for Friends" },
  { key: "food-space-for-tourists", label: "Food Space for Tourists" },
  { key: "food-space-w-potential", label: "Food Space with Potential" },
  { key: "food-space-needs-work", label: "Food Space Needs Work" },
  { key: "food-w-a-view", label: "Food with a View" },
  { key: "heritage-food-space", label: "Heritage Food Space" },
  { key: "inherited-flavors", label: "Inherited Flavors" },
  { key: "market-and-plaza-eats", label: "Market and Plaza Eats" },
  { key: "spaces-w-food-on-the-go", label: "Spaces with Food on the Go" },
] as const;

export type StickerType = (typeof StickerTypes)[number]["key"];

export interface PlacedSticker {
  lat: number;
  lng: number;
  type: StickerType;
}
