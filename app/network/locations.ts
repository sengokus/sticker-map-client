import { getApiUrl } from "../lib/api";
import type {
  SubmitResponsePayload,
  SubmitResponseResult,
} from "../types/locations";

export async function getResponseStatus(
  accessToken: string,
): Promise<{ hasResponded: boolean }> {
  try {
    const url = getApiUrl("/api/locations/status");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) throw new Error("Failed to check response status");

    const data = (await res.json()) as { hasResponded?: boolean };
    return { hasResponded: data.hasResponded === true };
  } catch (err) {
    throw new Error(
      `Failed to check response status: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export async function submitResponse(
  accessToken: string,
  payload: SubmitResponsePayload,
): Promise<SubmitResponseResult> {
  const url = getApiUrl("/api/locations");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as SubmitResponseResult;

  if (res.status === 409) {
    return { ...data, success: false, alreadyResponded: true };
  }

  if (!res.ok || data.success === false) {
    const message =
      res.status === 401
        ? (data.error ?? "Authentication required.")
        : (data.error ?? "Something went wrong. Please try again.");
    throw new Error(message);
  }

  return data;
}
