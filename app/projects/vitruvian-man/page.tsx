import type { Metadata } from "next";
import Deck from "@/components/vitruvian/Deck";

export const metadata: Metadata = {
  title: "Vitruvian Man",
  description: "A short visual presentation on Leonardo da Vinci's Vitruvian Man.",
  alternates: { canonical: "/projects/vitruvian-man" },
};

export default function VitruvianManPage() {
  return <Deck />;
}
