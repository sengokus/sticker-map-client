"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminResponses } from "../network/admin/responses";

export const adminKeys = {
  all: ["admin"] as const,
  responses: (adminKey: string) =>
    [...adminKeys.all, "responses", adminKey] as const,
};

export function useAdminResponses(adminKey: string) {
  return useQuery({
    queryKey: adminKeys.responses(adminKey),
    queryFn: () => fetchAdminResponses(adminKey),
    enabled: !!adminKey,
  });
}
