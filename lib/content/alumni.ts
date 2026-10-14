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

export const alumni: Alumnus[] = [
  {
    id: "karandeep",
    name: "Karandeep Singh",
    initials: "KS",
    batch: 2026,
    image: "/images/alumni/2026/karandeep.png",
    role: "Chapter lead",
    session: "2024–25",
    links: {
      linkedin: "https://www.linkedin.com/in/karandeep-singh-710719253/",
      instagram: "https://www.instagram.com/xx_k7d_xx/",
    },
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
    links: {
      linkedin: "https://www.linkedin.com/in/arnav-anand2/",
      instagram: "https://www.instagram.com/aight.arnav/",
    },
  },
  {
    id: "arushi",
    name: "Arushi Gupta",
    initials: "AG",
    batch: 2026,
    image: "/images/alumni/2026/arushi.png",
    department: "wit",
    note: "The beginning of the WiT community.",
    links: {
      linkedin: "https://www.linkedin.com/in/arushi-gupta1344/",
      instagram: "https://www.instagram.com/arushi.guptaa/",
    },
  },
  {
    id: "deepak",
    name: "Deepak Kumar",
    initials: "DK",
    batch: 2026,
    image: "/images/alumni/2026/deepak.png",
    department: "devsecops",
    note: "DevSecOps or Optum, he's the guy.",
    links: {
      linkedin: "https://www.linkedin.com/in/deepakkumar-dev/",
      instagram: "https://www.instagram.com/what.deepak_/",
    },
  },
  {
    id: "gaurav",
    name: "Gaurav Upadhyay",
    initials: "GU",
    batch: 2026,
    image: "/images/alumni/2026/gaurav.jpeg",
    department: "web",
    note: "Always building and shipping for the web.",
    links: {
      linkedin: "https://www.linkedin.com/in/igauravupadhyay/",
      instagram: "https://www.instagram.com/itzzzgaurav7/",
      website: "https://gauravupadhyay.space/",
    },
  },
  {
    id: "himanshu",
    name: "Himanshu Dania",
    initials: "HD",
    batch: 2026,
    image: "/images/alumni/2026/himanshu.png",
    department: "ai",
    note: "Take his MS interview tips.",
    links: {
      linkedin: "https://www.linkedin.com/in/himanshu-bedi-66365521a/",
      instagram: "https://www.instagram.com/himanshudania13/",
    },
  },
  {
    id: "joyjeet",
    name: "Joyjeet Banerjee",
    initials: "JB",
    batch: 2026,
    image: "/images/alumni/2026/joyjeet.png",
    department: "mobile",
    note: "Talk to him about futures first.",
    links: {
      linkedin: "https://www.linkedin.com/in/joyjeet-banerjee-075420253/",
      instagram: "https://www.instagram.com/_joyjeetb2319/",
    },
  },
  {
    id: "saurabh",
    name: "Saurabh Sahu",
    initials: "SS",
    batch: 2026,
    image: "/images/alumni/2026/saurabh.jpeg",
    department: "cp",
    role: "CP lead",
    note: "The go-to person for CP and algorithms.",
    links: {
      linkedin: "https://www.linkedin.com/in/saurabh-sahu-010223246/",
      instagram: "https://www.instagram.com/saurabh_sahu_4/",
    },
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
  {
    id: "irfan",
    name: "Irfan Mohumand",
    initials: "IM",
    batch: 2027,
    image: "/images/alumni/2027/irfan.webp",
    department: "mobile",
    links: {
      linkedin: "https://www.linkedin.com/in/irfan-mohammed-a2439920b/",
      instagram: "https://www.instagram.com/irfan_olshe/",
    },
  },
  {
    id: "jagjit",
    name: "Jagjit Singh",
    initials: "JS",
    batch: 2027,
    image: "/images/alumni/2027/jagjit.webp",
    department: "web",
    links: {
      linkedin: "https://www.linkedin.com/in/jagjit0306/",
      instagram: "https://www.instagram.com/jagjit0306/",
    },
  },
  {
    id: "jayant",
    name: "Jayant Joshi",
    initials: "JJ",
    batch: 2027,
    image: "/images/alumni/2027/jayant.PNG",
    department: "ui",
    role: "UI/UX lead",
    links: {
      linkedin: "https://www.linkedin.com/in/jayant-joshi001/",
      instagram: "https://www.instagram.com/joshi._2/",
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
    id: "vaibhav",
    name: "Vaibhav Kanda",
    initials: "VK",
    batch: 2027,
    image: "/images/alumni/2027/vaibhav.webp",
    department: "creatives",
    links: {
      linkedin: "https://www.linkedin.com/in/vaibhavkanda/",
      instagram: "https://www.instagram.com/vaibhav.kanda",
    },
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
    id: "vymoika",
    name: "Vymoika",
    initials: "V",
    batch: 2027,
    image: "/images/alumni/2027/vymoika.webp",
    department: "wit",
    links: {
      linkedin: "https://www.linkedin.com/in/vyomika-tech/",
      instagram: "https://www.instagram.com/cloudiinn/",
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
