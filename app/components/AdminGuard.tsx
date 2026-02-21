"use client";

import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";
import { Bounce, toast } from "react-toastify";

const STORAGE_KEY = "adminKey";

const AdminContext = createContext<{
  logout: () => void;
  adminKey: string;
} | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminGuard");
  return ctx;
}

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState<string | null>(null);

  const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY!;

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      requestAnimationFrame(() => setAdminPassword(stored));
    }
  }, []);

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!adminKey) {
        throw new Error(
          "Admin key is not configured. Set NEXT_PUBLIC_ADMIN_KEY.",
        );
      }

      if (password !== adminKey) {
        toast.error("Invalid password!", {
          toastId: "admin-login-error",
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      // set session storage so admin can stay logged in
      sessionStorage.setItem(STORAGE_KEY, adminKey);
      setAdminPassword(adminKey);
    },
    [password, adminKey],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminPassword(null);
  }, []);

  if (!adminPassword) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen w-screen bg-white">
        <div className="max-w-sm w-full mx-4 p-8 border border-gray-200 rounded-[25px] shadow-xl">
          <h1 className="text-xl font-bold text-[#48BF7E] mb-6 text-center">
            Admin Dashboard
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password<span className="text-red-500"> *</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-[25px] focus:ring-2 focus:ring-[#48BF7E] focus:border-transparent outline-none text-gray-900 placeholder:text-gray-300 placeholder:text-sm"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={`py-3 px-6 rounded-[25px] font-medium bg-[#48BF7E] hover:bg-[#48BF7E]/80 text-white transition-all cursor-pointer w-full`}
            >
              Log In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <AdminContext.Provider value={{ logout, adminKey: adminPassword }}>
      {children}
    </AdminContext.Provider>
  );
}
