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

// Roles and notes come from the previous alumni page. Confirm the missing departments with the club.
// Replace each 2027 placeholder with a real entry and remove `pending`.
export const alumni: Alumnus[] = [
  { id: "2027-1", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
  { id: "2027-2", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
  { id: "2027-3", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
  { id: "2027-4", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
  { id: "2027-5", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
  { id: "2027-6", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
  { id: "2027-7", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
  { id: "2027-8", name: "Name coming soon", initials: "?", batch: 2027, pending: true },
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
    note: "Talk to him about futures first.",
  },
  {
    id: "deepak",
    name: "Deepak Kumar",
    initials: "DK",
    batch: 2026,
    image: "/images/alumni/2026/deepak.png",
    note: "DevSecOps or Optum, he's the guy.",
  },
  {
    id: "himanshu",
    name: "Himanshu Dania",
    initials: "HD",
    batch: 2026,
    image: "/images/alumni/2026/himanshu.png",
    note: "Take his MS interview tips.",
  },
];

export function alumniByBatch() {
  const batches = [...new Set(alumni.map((person) => person.batch))].sort((a, b) => b - a);
  return batches.map((batch) => ({
    batch,
    people: alumni.filter((person) => person.batch === batch),
  }));
}
