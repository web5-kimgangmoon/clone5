import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import "pretendard/dist/web/static/pretendard.css";

// const pretendard = localFont({
//   src: "../../node_modules/pretendard/dist/web/static/woff2/PretendardVariable.woff2",
//   display: "swap",
//   weight: "45 920", // Pretendard variable font supports weights from 45 to 920
//   variable: "--font-pretendard",
// });

export const metadata: Metadata = {
  title: "Clone starbux",
  description: "Clone coding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "Pretendard, sans-serif" }}>{children}</body>
    </html>
  );
}
