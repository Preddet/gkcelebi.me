import type { Metadata } from "next";
import { dmSans, inter, sourceSerif, lora, fragmentMono } from "@/lib/fonts";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gökberk Çelebi",
    template: "%s - Gökberk Çelebi",
  },
  description:
    "Bioengineering student at IZTECH — photography, diving, and music.",
  icons: {
    icon: [
      { url: "/favicon-white.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-black.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} ${sourceSerif.variable} ${lora.variable} ${fragmentMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 px-8 py-10 md:px-16 md:py-16">{children}</main>
      </body>
    </html>
  );
}
