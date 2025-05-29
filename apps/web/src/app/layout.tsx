import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@repo/design/components/ui/sonner";

import { TRPCReactProvider } from "~/trpc/react";

import "@repo/design/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

import { env } from "~/env";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? `https://${env.NEXT_PUBLIC_ROOT_DOMAIN}`
      : "http://localhost:3000",
  ),
  title: "Next Oral - Modern Dental Management Software",
  description:
    "Comprehensive dental practice management software by Norden, designed to streamline your dental operations and enhance patient care",
  openGraph: {
    title: "Next Oral - Modern Dental Management Software",
    description:
      "Comprehensive dental practice management software by Norden, designed to streamline your dental operations and enhance patient care",
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
    <html lang="en">
      <head>
        {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Toaster theme="light" richColors position="top-center" />
        <TRPCReactProvider>
          <ReactQueryDevtools />
          <NuqsAdapter>{props.children}</NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
