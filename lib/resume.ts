export const resumeHeader = {
  name: "Gökberk Çelebi",
  phone: "+90 505 213 63 33",
  email: "gokberkcelebi@std.iyte.edu.tr",
  location: "Urla, İzmir",
  linkedin: "https://www.linkedin.com/in/g%C3%B6kberk-%C3%A7elebi/",
};

export const summary =
  "Bioengineering undergraduate currently gaining hands-on experience in nanobody production and protein engineering through research lab work. Driven by a strong interest in protein design and production for therapeutic applications. Seeking internships to further develop hands-on expertise in protein engineering and contribute to the development of next-generation biologics.";

export type Entry = {
  title: string;
  date: string;
  org?: string;
  subtitle?: string;
  href?: string;
  bullets?: string[];
};

export const education: Entry[] = [
  {
    title: "Izmir Institute of Technology",
    subtitle: "Bachelor of Science in Bioengineering",
    date: "September 2023 – Present",
    bullets: ["GPA 3.4 / 4.0"],
  },
];

export const experience: Entry[] = [
  {
    title: "Research Intern",
    org: "Izmir Biomedicine and Genome Center (IBG), Kalyoncu Laboratory",
    date: "August 2026 – September 2026",
    bullets: [
      "Worked in Dr. Sibel Kalyoncu's antibody engineering laboratory on developing nanobody candidates against immune-checkpoint targets and studying how immune-checkpoint molecules interact.",
      "Performed ELISA and pH-dependent binding assays, SDS-PAGE and Western blot analysis, Protein A affinity chromatography, and wound healing assays with quantitative image analysis.",
    ],
  },
  {
    title: "Undergraduate Researcher",
    org: "TÜBİTAK 2247-C STAR Program, IZTECH",
    date: "January 2026 – July 2026",
    bullets: [
      "Conducted research on antibody engineering under Asst. Prof. Hümeyra Taşkent Sezgin within the TÜBİTAK 2247-C STAR Program, focusing on nanobodies targeting HIV-1 capsid proteins.",
      "Hands-on experience in recombinant protein expression, Ni-NTA & ion exchange chromatography, SDS-PAGE & UV characterization and PCR applications.",
    ],
  },
];

export const activities: Entry[] = [
  {
    title: "President",
    org: "IZTECH Sub-Aqua Society",
    date: "June 2025 – June 2026",
    bullets: [
      "Managed operations for a 200+ member society (dive trips, seminars and outreach projects) while designing and facilitating SCUBA courses for new members.",
    ],
  },
  {
    title: "Chairperson",
    org: "IEEE IZTECH Student Branch, Engineering in Medicine and Biology Society (EMBS)",
    date: "September 2024 – September 2025",
    bullets: [
      "Elected Chairperson, organized student-led technical trips, trainings and seminars reaching 100+ attendees.",
    ],
  },
];

export const skills = {
  technical:
    "Recombinant Protein Expression, SDS-PAGE & UV Absorbance, PCR, Chromatography (Ni-NTA, Ion Exchange, Size Exclusion, Protein A), ELISA & pH-Dependent Binding Assays, Western Blotting, Scratch Wound Healing Assay, Mammalian Cell Culture",
  software: "SnapGene, ImageJ, Fusion 360, ANSYS, Basic Python, Microsoft 365, Adobe Suite",
};

export const languages = [
  { label: "English", value: "Advanced" },
  { label: "Turkish", value: "Native" },
];

export const projects: Entry[] = [
  {
    title: "smartepitope.gkcelebi.me",
    href: "https://smartepitope.gkcelebi.me",
    subtitle: "SmartEpitope — Epitope Discovery Platform",
    date: "March 2026",
    bullets: [
      "Developed a personal bioinformatics project exploring potential binding sites on viral antigens (SARS-CoV-2, SARS-CoV-1, Influenza A) by combining entropy-based conservation scoring with Meta's ESM-2 protein language model.",
      "Compared model predictions against IEDB epitope records using IoU metric and integrated Mol* for 3D structural visualization.",
    ],
  },
  {
    title: "htspeptidelab.com",
    href: "https://htspeptidelab.com",
    subtitle: "Peptide & Protein Engineering Research Group",
    date: "February 2026",
    bullets: [
      "Developed and currently maintain the official laboratory website using HTML5, CSS3 and JavaScript to showcase research projects, publications and the team.",
    ],
  },
];

export const programs: Entry[] = [
  {
    title: "Program Participant - Possible With You",
    org: "Novartis Türkiye & Bilim Virüsü",
    date: "January 2026 – Present",
    bullets: [
      "Selected as 1 of 100 from 1,000 applicants for an 8-month program focused on career readiness, mentorship, and professional identity building.",
    ],
  },
  {
    title: "Inclusion School Participant",
    org: "AstraZeneca Türkiye",
    date: "December 2025 – June 2026",
    bullets: [
      "Selected as 1 of 50 university students nationwide for a 6-month DEI-focused program on inclusive leadership, gender equality, bias awareness, and social impact design.",
    ],
  },
];

export const certifications = [
  { label: "Fundamentals of Western Blotting", org: "Bio-Rad Academy" },
  { label: "Autodesk 360 Certification", org: "Autodesk" },
];
