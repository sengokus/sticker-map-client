"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchResponses } from "../network/results";

export const resultKeys = {
  all: ["results"] as const,
  list: () => [...resultKeys.all, "list"] as const,
};

export function useShowResponses() {
  return useQuery({
    queryKey: resultKeys.list(),
    queryFn: fetchResponses,
  });
}