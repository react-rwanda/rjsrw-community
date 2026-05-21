import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800", "900"],
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "React JS Rwanda — The Community Platform",
    template: "%s · React JS Rwanda",
  },
  description:
    "The official platform for Rwanda's React developer community. Events, publications, members, and a public forum — built by the community, for the community.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "React JS Rwanda — The Community Platform",
    description: "Scaling the future of Rwanda with React.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-neutral-0 text-neutral-900 antialiased">
        <QueryProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: 0,
                border: "1px solid var(--color-neutral-200)",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
