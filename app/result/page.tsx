"use client";

import dynamic from "next/dynamic";
import { useShowResponses } from "../hooks/useShowResponses";

const AdminMap = dynamic(() => import("../components/AdminMap"), {
  ssr: false,
});

export default function ShowResultsPage() {
  const { data, isLoading, error } = useShowResponses();

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen w-full bg-white">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen w-full bg-white">
        <div className="text-red-500">Failed to load results</div>
      </main>
    );
  }

  const stickers = data?.stickers ?? [];

  return (

      <main className="flex flex-col h-screen w-screen bg-white">
        <div className="flex-1 min-h-0 relative">
          <AdminMap stickers={stickers} />
        </div>
      </main>

  );
}