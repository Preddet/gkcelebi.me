import {
  DM_Sans,
  Inter,
  Source_Serif_4,
  Lora,
  Fragment_Mono,
} from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment-mono",
});
