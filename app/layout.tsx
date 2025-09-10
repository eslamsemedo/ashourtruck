import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <Providers>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
