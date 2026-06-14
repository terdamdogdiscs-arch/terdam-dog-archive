import type { Metadata } from "next";
import { Anton, Oswald } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://terdam-dog-archive.vercel.app"),
  title: "TerdamDog Archive",
  description:
    "Arquivo pessoal de vinil. EST. 2026 · BRASIL · VINYL COLLECTOR · ANTIFA · 174 BPM",
  keywords: [
    "vinil",
    "coleção",
    "reggae",
    "hip-hop",
    "jazz",
    "brasil",
    "vinyl collector",
  ],
  openGraph: {
    title: "TerdamDog Archive",
    description:
      "Arquivo pessoal de vinil. EST. 2026 · BRASIL · VINYL COLLECTOR · ANTIFA · 174 BPM",
    url: "/",
    siteName: "TerdamDog Archive",
    images: ["/logo.png"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
