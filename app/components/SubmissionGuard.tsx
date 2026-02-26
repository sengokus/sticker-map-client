"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { getResponseStatus } from "../network/locations";

const SubmissionContext = createContext<{
  setSubmitted: () => void;
} | null>(null);

export function useSubmission() {
  const ctx = useContext(SubmissionContext);
  if (!ctx)
    throw new Error("useSubmission must be used within SubmissionGuard");
  return ctx;
}

export function SubmissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if ((pathname?.startsWith("/admin") || pathname?.startsWith("/result"))) return;

    (async () => {
      const { data } = await supabase.auth.getSession();
      let session = data?.session;

      if (!session) {
        // sign in anonymously to track if user has already submitted a response
        const { data: signInData, error } =
          await supabase.auth.signInAnonymously();
        if (error) {
          console.error("Anonymous sign-in failed:", error);
          setIsReady(true);
          return;
        }
        session = signInData.session;
      }

      if (session?.access_token) {
        try {
          const { hasResponded } = await getResponseStatus(
            session.access_token,
          );
          if (hasResponded) setIsSubmitted(true);
        } catch {
          // do not throw if status is not available
        }
      }

      setIsReady(true);
    })();
  }, [pathname]);

  if ((pathname?.startsWith("/admin") || pathname?.startsWith("/result"))) {
    return <>{children}</>;
  }

  const setSubmitted = () => setIsSubmitted(true);

  if (!isReady) {
    return null;
  }

  if (isSubmitted) {
    return (
      <main className="flex flex-col items-center justify-center h-screen w-screen relative bg-white">
        <div className="fixed inset-0 flex items-center justify-center z-[2000]">
          <div className="max-w-lg w-full mx-4 p-8 text-center">
            <h1 className="text-2xl font-bold text-[#48BF7E] mb-4">
              Thank you for your response
            </h1>
            <p className="text-gray-600 mb-6">
              You have already submitted a response to this survey.
            </p>
            <button
                  onClick={() => router.push("/result")}
                  className={`py-3 px-6 rounded-[25px] font-medium bg-[#48BF7E] hover:bg-[#48BF7E]/80 text-white transition-all cursor-pointer`}
                >
                  Show Responses
                </button>

          </div>
        </div>
      </main>
    );
  }

  return (
    <SubmissionContext.Provider value={{ setSubmitted }}>
      {children}
    </SubmissionContext.Provider>
  );
}
