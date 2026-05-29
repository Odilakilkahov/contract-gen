import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContractGen — Контракты за 2 минуты",
  description: "Создавай профессиональные контракты для инфлюенсеров без юриста. ИИ-генерация, e-подписи, защита от рисков.",
  keywords: ["контракты инфлюенсер", "creator contracts", "brand deals", "e-signatures", "influencer marketing"],
  openGraph: {
    title: "ContractGen — Контракты за 2 минуты",
    description: "Создавай профессиональные контракты для инфлюенсеров без юриста.",
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
      lang="ru"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <CookieConsent />
      </body>
    </html>
  );
}
