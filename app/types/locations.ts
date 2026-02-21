export interface SubmitResponsePayload {
  stickers: { lat: number; lng: number; sticker_type: string }[];
  username?: string;
}

export interface SubmitResponseResult {
  success: boolean;
  message?: string;
  error?: string;
  alreadyResponded?: boolean;
  atlas_response_id?: string;
  response_id?: string;
  stickers?: unknown[];
}
