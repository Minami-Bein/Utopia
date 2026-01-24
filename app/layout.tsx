import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { RootProvider } from "./rootProvider";
import Navigation from "./components/Navigation";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "匿名活动组织平台 | Anonymous Event Platform",
  description:
    "基于 Web3 的去中心化匿名活动组织平台，使用 OnchainKit 构建",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${sourceCodePro.variable}`}>
        <RootProvider>
          <Navigation />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
