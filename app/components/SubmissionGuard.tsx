"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { SUBMITTED_KEY } from "../constants/survey";

const SubmissionContext = createContext<{
  setSubmitted: () => void;
} | null>(null);

export function useSubmission() {
  const ctx = useContext(SubmissionContext);
  if (!ctx) throw new Error("useSubmission must be used within SubmissionGuard");
  return ctx;
}

export function SubmissionGuard({ children }: { children: React.ReactNode }) {
  const [isSubmitted, setIsSubmitted] = useState<boolean | null>(null);

  useEffect(() => {
    const submitted = localStorage.getItem(SUBMITTED_KEY) === "true";
    const id = requestAnimationFrame(() => setIsSubmitted(submitted));
    return () => cancelAnimationFrame(id);
  }, []);

  const setSubmitted = () => setIsSubmitted(true);

  if (isSubmitted === null) {
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
            <p className="text-gray-600">
              You have already submitted a response to this survey.
            </p>
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
