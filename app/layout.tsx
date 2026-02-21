import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { SubmissionGuard } from "./components/SubmissionGuard";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Iloilo Food-Space Atlas",
  description:
    "Digesting Architecture: Analyzing the Relationship of Food and Space in Iloilo City",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ToastContainer />
          <SubmissionGuard>{children}</SubmissionGuard>
        </Providers>
      </body>
    </html>
  );
}
