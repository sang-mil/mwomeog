import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "먹결 - 오늘 뭐 먹지?",
  description: "지도에서 발견하고, 맛집을 넘겨보고, 오늘 먹을 것을 결정하세요.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-black text-gray-900 antialiased selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
