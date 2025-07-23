import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dairo",
  description: "Your intelligent co-pilot for prompt engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontPoppins.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
