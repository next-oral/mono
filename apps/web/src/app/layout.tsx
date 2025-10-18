import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@repo/design/components/ui/sonner";

import { TRPCReactProvider } from "~/trpc/react";

import "@repo/design/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { env } from "~/env";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "../providers/theme-provider";
import { ZeroQueryProvider } from "../providers/zero";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://nextoral.com"
      : "http://localhost:3000",
  ),
  title: "Next Oral - Modern Dental Management Software",
  description:
    "Comprehensive dental practice management software by NextOral, designed to streamline your dental operations and enhance patient care",
  openGraph: {
    title: "Next Oral - Modern Dental Management Software",
    description:
      "Comprehensive dental practice management software by NextOral, designed to streamline your dental operations and enhance patient care",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable}`}
    >
      <head>
        {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen antialiased",
          geistSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          forcedTheme="light"
        >
          <Toaster theme="light" richColors position="top-center" />
          <TRPCReactProvider>
            <ReactQueryDevtools />
            <NuqsAdapter>
              <ZeroQueryProvider>{props.children}</ZeroQueryProvider>
            </NuqsAdapter>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
