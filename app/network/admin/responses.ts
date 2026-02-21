import type { AdminResponsesPayload } from "../../types/admin";
import { getApiUrl } from "../../lib/api";

export async function fetchAdminResponses(
  adminKey: string,
): Promise<AdminResponsesPayload> {
  try {
    const url = getApiUrl("/admin/responses");
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": adminKey,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        res.status === 401
          ? "Invalid admin key"
          : `Failed to fetch responses: ${res.status} ${text}`,
      );
    }

    return res.json();
  } catch (err) {
    throw new Error(`Failed to fetch admin responses: ${err}`);
  }
}
