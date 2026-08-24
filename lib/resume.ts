export const resumeHeader = {
  name: "Gökberk Çelebi",
  phone: "+90 505 213 63 33",
  email: "gokberkcelebi@std.iyte.edu.tr",
  location: "İzmir Institute of Technology, Urla/İzmir",
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
    title: "Undergraduate Researcher",
    org: "TÜBİTAK – IZTECH",
    date: "January 2026 – July 2026",
    bullets: [
      "Conducting research on antibody engineering under Asst. Prof. Hümeyra Taşkent Sezgin within the TÜBİTAK 2247-C STAR Program, focusing on nanobodies targeting HIV-1 capsid proteins.",
      "Hands-on experience in recombinant protein expression, Ni-NTA & ion exchange chromatography, SDS-PAGE & UV characterization and PCR applications.",
    ],
  },
];

export const activities: Entry[] = [
  {
    title: "President of the Sub-Aqua Society",
    org: "IZTECH Sub-Aqua Society",
    date: "June 2025 – June 2026",
    bullets: [
      "Managing operations for a 200+ member society — dive trips, seminars and outreach projects — while designing and facilitating SCUBA courses for new members.",
    ],
  },
  {
    title: "Chairperson of EMBS",
    org: "IEEE IZTECH Student Branch",
    date: "September 2024 – September 2025",
    bullets: [
      "Elected Chairperson of IEEE IZTECH Engineering in Medicine and Biology Society, organized student-led technical trips, trainings and seminars reaching 100+ attendees.",
    ],
  },
];

export const skills = {
  technical:
    "Recombinant Protein Expression, SDS-PAGE & UV Absorbance Characterization, PCR, Chromatography (Ni-NTA, Ion exchange, Size Exclusion)",
  software: "Fusion 360, ANSYS, Basic Python, Microsoft 365 Suite, Adobe Suite",
  interests: "Diving (CMAS** SCUBA Diver), Photography, Piano, Archery, Lindy Hop/Swing Dances",
};

export const languages = [
  { label: "English", value: "Advanced" },
  { label: "Turkish", value: "Native" },
];

export const honors = [
  { label: "TÜBİTAK STAR Scholar", value: "Jan. 2026" },
  { label: "High Honors", value: "Spring 2026" },
  { label: "High Honors", value: "Fall 2025" },
  { label: "Honors", value: "Fall 2024" },
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
      "Built a dynamic \"Peptide Playground\" that translates users' names into peptides, utilizing RDKit and Mol* for real-time 2D structural drawing and 3D coordinate modeling directly in the browser.",
    ],
  },
];

export const programs: Entry[] = [
  {
    title: "Program Participant | Novartis - Possible With You",
    date: "January 2026 – Present",
    bullets: [
      "Selected as 1 of 100 from 1,000 applicants for an 8-month Novartis Türkiye & Bilim Virüsü program.",
      "Developing skills in career readiness, mentorship, and professional identity building.",
    ],
  },
  {
    title: "Program Participant | AstraZeneca Inclusion School",
    date: "December 2025 – June 2026",
    bullets: [
      "Selected as 1 of 50 university students nationwide for a 6-month DEI-focused program.",
      "Training in inclusive leadership, gender equality, bias awareness, and social impact design.",
    ],
  },
];

export const certifications = [
  { label: "Autodesk 360 Certification", org: "Autodesk" },
  { label: "Molecule to Market Job Simulation", org: "Pfizer UK" },
  { label: "Robotics and Controls Job Simulation", org: "Johnson&Johnson MedTech" },
];
