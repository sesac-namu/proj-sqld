import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Config from "@/components/config";
import Header from "@/components/Header"; // Header 컴포넌트 임포트 (경로 별칭 @ 사용)
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SQLD CBT",
  description: "SQLD 자격증 준비를 위한 CBT 연습 사이트",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Config
          NEXT_PUBLIC_API_URL={env.NEXT_PUBLIC_API_URL}
          NEXT_PUBLIC_SITE_URL={env.NEXT_PUBLIC_SITE_URL}
        >
          <div className="min-h-svh">
            <Header />
            <main className="h-full">{children}</main>
          </div>
        </Config>
      </body>
    </html>
  );
}
