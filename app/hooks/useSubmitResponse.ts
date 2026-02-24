"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { submitResponse } from "../network/locations";
import type { SubmitResponsePayload } from "../types/locations";

export function useSubmitResponse() {
  return useMutation({
    mutationFn: async (payload: SubmitResponsePayload) => {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error)
          throw new Error(
            "Authentication failed. Please refresh and try again.",
          );
        session = data.session;
      }

      const token = session?.access_token;
      if (!token)
        throw new Error(
          "Authentication required. Please refresh and try again.",
        );

      return submitResponse(token, payload);
    },
  });
}
