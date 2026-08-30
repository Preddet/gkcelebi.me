import type { Metadata } from "next";
import ELISAProcessor from "@/components/ELISAProcessor";

export const metadata: Metadata = {
  title: "ELISA Analysis Tool",
  description:
    "Turn raw ELISA plate reader OD values into blank-subtracted, GraphPad-ready data. Runs entirely in the browser.",
  alternates: { canonical: "/tools/elisa" },
};

export default function ElisaToolPage() {
  return <ELISAProcessor />;
}
