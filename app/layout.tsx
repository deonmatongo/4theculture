import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "4theculture — Events, Nightlife & Community",
    template: "%s · 4theculture",
  },
  description:
    "4theculture is an event-hosting collective. Discover parties, live music, and community gatherings — get your tickets and join the movement.",
  keywords: ["events", "nightlife", "tickets", "parties", "live music", "community"],
  openGraph: {
    title: "4theculture",
    description: "Events, nightlife & community. Get your tickets.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05040a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
