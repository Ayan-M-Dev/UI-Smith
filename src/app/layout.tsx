import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TamboClientProvider } from "@/tambo/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UI-Smith | AI-Powered Generative UI",
  description: "Create beautiful, accessible UIs from natural language using AI. Built with Tambo SDK and MCP integration.",
  keywords: ["AI", "UI", "generative", "React", "design", "accessibility", "MCP"],
  authors: [{ name: "UI-Smith Team" }],
  openGraph: {
    title: "UI-Smith | AI-Powered Generative UI",
    description: "Create beautiful, accessible UIs from natural language using AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TamboClientProvider>
          {children}
        </TamboClientProvider>
      </body>
    </html>
  );
}
