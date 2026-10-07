import { type Department, type ProfileLinks } from "@/lib/content/home";

export type Alumnus = {
  id: string;
  name: string;
  initials: string;
  /** Graduation year. The page groups alumni by this value. */
  batch: number;
  image?: string;
  /** Department `id` from `lib/content/home.ts`, for the icon and title. */
  department?: Department["id"];
  /** Role shown on the card, such as "Chapter lead". Defaults to the department title. */
  role?: string;
  /** Session the role was held, such as "2024–25". */
  session?: string;
  /** Current company or program, shown as "@ Microsoft". */
  nowAt?: string;
  note?: string;
  links?: ProfileLinks;
  /** Placeholder card. Search skips it. */
  pending?: boolean;
};

// Roles and notes for 2026 come from the previous alumni page.
export const alumni: Alumnus[] = [
  {
    id: "karandeep",
    name: "Karandeep Singh",
    initials: "KS",
    batch: 2026,
    image: "/images/alumni/2026/karandeep.png",
    role: "Chapter lead",
    session: "2024–25",
  },
  {
    id: "arnav",
    name: "Arnav Anand",
    initials: "AA",
    batch: 2026,
    image: "/images/alumni/2026/arnav.png",
    department: "ui",
    role: "UI/UX lead",
    note: "The pookiest UI/UX lead ever.",
  },
  {
    id: "arushi",
    name: "Arushi Gupta",
    initials: "AG",
    batch: 2026,
    image: "/images/alumni/2026/arushi.png",
    department: "wit",
    note: "The beginning of the WiT community.",
  },
  {
    id: "joyjeet",
    name: "Joyjeet Banerjee",
    initials: "JB",
    batch: 2026,
    image: "/images/alumni/2026/joyjeet.png",
    department: "mobile",
    note: "Talk to him about futures first.",
  },
  {
    id: "deepak",
    name: "Deepak Kumar",
    initials: "DK",
    batch: 2026,
    image: "/images/alumni/2026/deepak.png",
    department: "devsecops",
    note: "DevSecOps or Optum, he's the guy.",
  },
  {
    id: "himanshu",
    name: "Himanshu Dania",
    initials: "HD",
    batch: 2026,
    image: "/images/alumni/2026/himanshu.png",
    department: "ai",
    note: "Take his MS interview tips.",
  },
  {
    id: "adesh",
    name: "Adesh Anurag",
    initials: "AA",
    batch: 2027,
    image: "/images/alumni/2027/adesh.webp",
    role: "Chapter lead",
    links: {
      linkedin: "https://www.linkedin.com/in/adesh-anurag/",
      instagram: "https://www.instagram.com/adexxhh",
    },
  },
  {
    id: "jagjit",
    name: "Jagjit Singh",
    initials: "JS",
    batch: 2027,
    image: "/images/alumni/2027/jagjit.webp",
    department: "web",
  },
  {
    id: "vaibhav",
    name: "Vaibhav Kanda",
    initials: "VK",
    batch: 2027,
    image: "/images/alumni/2027/vaibhav.webp",
    department: "creatives",
  },
  {
    id: "irfan",
    name: "Irfan Mohumand",
    initials: "IM",
    batch: 2027,
    image: "/images/alumni/2027/irfan.webp",
    department: "mobile",
  },
  {
    id: "vymoika",
    name: "Vymoika",
    initials: "V",
    batch: 2027,
    image: "/images/alumni/2027/vymoika.webp",
    department: "wit",
  },
  {
    id: "vivek",
    name: "Vivek Dhiman",
    initials: "VD",
    batch: 2027,
    image: "/images/alumni/2027/vivek.webp",
    department: "ai",
    role: "AI/ML lead",
    links: {
      linkedin: "https://www.linkedin.com/in/vivek-dhiman-159a48254",
      instagram: "https://www.instagram.com/vwv.8882",
    },
  },
  {
    id: "priyanshu",
    name: "Priyanshu Bhardwaj",
    initials: "PB",
    batch: 2027,
    image: "/images/alumni/2027/priyanshu.webp",
    department: "cp",
    role: "CP lead",
    links: {
      linkedin: "https://www.linkedin.com/in/priyanshub18",
      instagram: "https://www.instagram.com/priyanshu.bhardwaj18",
    },
  },
  {
    id: "davinder",
    name: "Davinder Singh",
    initials: "DS",
    batch: 2027,
    image: "/images/alumni/2027/davinder.webp",
    department: "devsecops",
    role: "DevSecOps lead",
    links: {
      linkedin: "https://www.linkedin.com/in/davinder-singh-913541302",
      instagram: "https://www.instagram.com/__davinder__sandhu",
    },
  },
];

export function alumniByBatch() {
  const batches = [...new Set(alumni.map((person) => person.batch))].sort((a, b) => b - a);
  return batches.map((batch) => ({
    batch,
    people: alumni.filter((person) => person.batch === batch),
  }));
}
