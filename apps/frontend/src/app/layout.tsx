import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Config from "@/components/config";
import Header from "@/components/Header"; // Header 컴포넌트 임포트 (경로 별칭 @ 사용)

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
        <Config>
          <Header />
          <main>{children}</main>
        </Config>
      </body>
    </html>
  );
}
