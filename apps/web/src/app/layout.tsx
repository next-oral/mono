import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";


import { TRPCReactProvider } from "~/trpc/react";

import {Toaster} from "@repo/design/components/ui/sonner"

import "@repo/design/globals.css"
import { env } from "~/env";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://nextoral.com"
      : "http://localhost:3000",
  ),
  title: "Next Oral - Modern Dental Management Software",
  description: "Comprehensive dental practice management software by Norden, designed to streamline your dental operations and enhance patient care",
  openGraph: {
    title: "Next Oral - Modern Dental Management Software",
    description: "Comprehensive dental practice management software by Norden, designed to streamline your dental operations and enhance patient care",
    siteName: "Next Oral",
  },
  twitter: {
    card: "summary_large_image",
    site: "@nextoral",
    creator: "@nextoral",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Toaster richColors position="top-center"/>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
          </div>
      </body>
    </html>
  );
}
