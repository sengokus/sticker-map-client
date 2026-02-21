export interface AdminSticker {
  id: string;
  sticker_type: string;
  // react-leaflet props
  lat: number;
  lng: number;
  // db column names
  latitude?: number;
  longitude?: number;
  username?: string;
  response_id?: string;
  created_at?: string;
}

export interface AdminResponse {
  id: string;
  username?: string;
  created_at?: string;
  stickers: AdminSticker[];
}

export interface AdminResponsesPayload {
  responses: AdminResponse[];
  stickers: AdminSticker[];
}
