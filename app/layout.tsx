import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
import Header from "@/components/header";
import { LanguageHtml } from "@/components/providers";
import { headers } from "next/headers";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <LanguageHtml />
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
