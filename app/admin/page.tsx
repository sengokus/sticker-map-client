"use client";

import dynamic from "next/dynamic";
import { useAdmin } from "../components/AdminGuard";
import { useAdminResponses } from "../hooks/useAdminResponses";

const AdminMap = dynamic(() => import("../components/AdminMap"), {
  ssr: false,
});

export default function AdminDashboardPage() {
  const { logout, adminKey } = useAdmin();
  const { data, isLoading, error } = useAdminResponses(adminKey);

  if (isLoading || !data) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen w-screen bg-white">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  const stickers = data.stickers ?? [];
  const responseCount = data.responses?.length ?? 0;

  return (
    <main className="flex flex-col h-screen w-screen bg-white">
      <header className="flex items-center justify-between px-4 py-4 shadow-md border-b border-gray-200 bg-white shrink-0">
        <div className="flex flex-col justify-start gap-1">
          <h1 className="text-lg font-bold text-[#48BF7E]">Admin Dashboard</h1>
          <div className="text-sm text-gray-600">
            {responseCount} response(s), {stickers.length} sticker(s)
          </div>
        </div>
        <button
          onClick={logout}
          className="cursor-pointer px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[25px] transition-all duration-300"
        >
          Sign Out
        </button>
      </header>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-700 text-sm" role="alert">
          {error.message}
        </div>
      )}

      <div className="flex-1 min-h-0 relative">
        <AdminMap stickers={stickers} />
      </div>
    </main>
  );
}
