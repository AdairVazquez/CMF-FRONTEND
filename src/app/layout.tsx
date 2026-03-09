import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMF — Control y Monitoreo de Fuerza Laboral",
  description: "Sistema administrativo de control laboral con NFC",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#0D1117",
              border: "1px solid #1C2333",
              color: "#F4F6F8",
            },
          }}
        />
      </body>
    </html>
  );
}
