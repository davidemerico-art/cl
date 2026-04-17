import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Salone Parrucchiere Premium",
  description: "Prenotazioni, Shop Prodotti e Tagli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <StoreProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          
          <footer className="w-full bg-secondary border-t border-border mt-auto py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-foreground/70">
                © 2026 Salon Lounge. Tutti i diritti riservati.
              </div>
              <div className="flex gap-4">
                <a href="/admin/login" className="text-xs text-foreground/40 hover:text-primary transition-colors">Area Riservata (Admin)</a>
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
