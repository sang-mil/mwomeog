import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "먹결 - 오늘 뭐 먹지?",
  description: "지도에서 발견하고, 맛집을 넘겨보고, 오늘 먹을 것을 결정하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
