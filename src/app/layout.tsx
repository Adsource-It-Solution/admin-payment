import "./globals.css";
import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";

export const metadata: Metadata = {
  title: "Payment Gateway",
  description: "Migrated from React app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Wrap everything in ThemeRegistry for MUI SSR */}
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
