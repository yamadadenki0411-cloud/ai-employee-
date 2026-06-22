import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI社員 | チャットで仕事を依頼できるAIチーム",
  description: "営業AI、マーケAI、開発AIを雇い、チャット形式で仕事を依頼できるサービス",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}