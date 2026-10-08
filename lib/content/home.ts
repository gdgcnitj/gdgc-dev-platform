import {
  BrainCircuit,
  Braces,
  CloudCog,
  Code2,
  HeartHandshake,
  PanelsTopLeft,
  PenTool,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { type BrandColor } from "@/lib/design/theme";

export type ClubEvent = {
  id: string;
  title: string;
  category?: string;
  description?: string;
  date?: string;
  venue?: string;
  time?: string;
  image?: string;
  /** Transparent artwork shown without a frame when there is no photo. */
  illustration?: string;
  /** Show the registration form on the event page. */
  registration?: boolean;
  color: BrandColor;
};
export type ProfileLinks = { linkedin?: string; instagram?: string; website?: string };
export type Department = {
  id: string;
  title: string;
  description: string;
  lead: string;
  initials: string;
  image?: string;
  icon: LucideIcon;
  href?: string;
  links?: ProfileLinks;
  color: BrandColor;
};
export type GalleryMoment = { id: string; caption: string; image?: string };

export const socialLinks = {
  instagram: "https://www.instagram.com/gdgcnitj/",
  linkedin: "https://www.linkedin.com/company/dscnitj/",
  github: "https://github.com/gdgcnitj",
  youtube: "https://www.youtube.com/@DSCNITJ",
  chapter: "https://gdg.community.dev/gdg-on-campus-dr-b-r-ambedkar-national-institute-of-technology-jalandhar-india/",
  email: "mailto:dsc@nitj.ac.in",
} as const;

// Add confirmed dates here. An empty list shows the announcement state.
export const upcomingEvents: ClubEvent[] = [
  {
    id: "orientation-2026",
    title: "Orientation 2026",
    description: "Meet the chapter, its eight departments, and the leads. Find out what we do and how to get involved this year.",
    date: "16 October 2026",
    illustration: "/images/events/orientation-2026.webp",
    registration: true,
    color: "yellow",
  },
];

// Details come from hackmol.com and the chapter's gdg.community.dev pages. Photos are pending.
export const pastEvents: ClubEvent[] = [
  {
    id: "hackmol",
    title: "HackMOL 7.0",
    category: "Hackathon",
    description: "NIT Jalandhar's flagship 30-hour onsite hackathon. Teams from across India build real-world solutions.",
    date: "28–29 March 2026",
    venue: "NIT Jalandhar",
    color: "blue",
  },
  {
    id: "winterfest",
    title: "WinterFest",
    category: "Workshops & contests",
    description: "Seminars in AI, UI/UX, full-stack development, and cybersecurity. Contest winners got direct entry to HackMOL 6.0.",
    date: "January–February 2025",
    venue: "WE-1, NIT Jalandhar",
    color: "green",
  },
  {
    id: "orientation",
    title: "Orientation",
    category: "On campus",
    description: "An info session for freshers on what the chapter does, its departments, and its plans for the year.",
    date: "September 2025",
    color: "yellow",
  },
];

export const allEvents = [...upcomingEvents, ...pastEvents];

export type ChapterLead = {
  id: string;
  name: string;
  initials: string;
  image?: string;
  links?: ProfileLinks;
  color: BrandColor;
};

export type FacultyCoordinator = {
  id: string;
  name: string;
  initials: string;
  image: string;
  title: string;
  email: string;
  profile: string;
  color: BrandColor;
};

// Names, titles, photos, emails, and profile links come from the CSE faculty directory:
// https://departments.nitj.ac.in/dept/cse/Faculty
// The directory lists Dr. Gopendra Vikram Singh as "Dr Gopendra". His publications there use the full name.
export const facultyCoordinators: FacultyCoordinator[] = [
  {
    id: "gopendra-vikram-singh",
    name: "Dr. Gopendra Vikram Singh",
    initials: "GS",
    image: "/images/faculty/gopendra-vikram-singh.jpg",
    title: "Assistant Professor",
    email: "gopendra@nitj.ac.in",
    profile: "https://departments.nitj.ac.in/dept/cse/Faculty/68cb9882f82446e66598e762",
    color: "blue",
  },
  {
    id: "prashant-shukla",
    name: "Dr. Prashant Shukla",
    initials: "PS",
    image: "/images/faculty/prashant-shukla.jpg",
    title: "Assistant Professor",
    email: "shuklap@nitj.ac.in",
    profile: "https://departments.nitj.ac.in/dept/cse/Faculty/68be8541f6d5734224e60b0a",
    color: "green",
  },
];

export const chapterLeads: ChapterLead[] = [
  {
    id: "anshuman",
    name: "Anshuman Bhardwaj",
    initials: "AB",
    image: "/images/leads/anshuman.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/anshuman-bhardwaj-89476b23b/",
      instagram: "https://www.instagram.com/ansh_who_man/",
      website: "https://anshuport.netlify.app/",
    },
    color: "blue",
  },
  { id: "ayush", name: "Ayush Poddar", initials: "AP", image: "/images/leads/ayush.jpg", color: "green" },
  {
    id: "prachi",
    name: "Prachi Goyal",
    initials: "PG",
    image: "/images/leads/prachi.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/prachi-goyal-226313325/",
      instagram: "https://www.instagram.com/prachigoyal_.26/",
    },
    color: "red",
  },
];

// Role and lead names reproduce the list supplied by the project owner.
export const departments: Department[] = [
  {
    id: "web",
    title: "Web Development",
    description: "Websites and web apps.",
    lead: "Mukal",
    initials: "M",
    icon: Code2,
    color: "blue",
  },
  {
    id: "creatives",
    title: "Creatives",
    description: "Design, stories, and visual content.",
    lead: "Vanshish",
    initials: "V",
    image: "/images/leads/vanshish.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/vanshishchaturvedi/",
      instagram: "https://www.instagram.com/vanshish_chaturvedi/",
    },
    icon: PenTool,
    color: "red",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Apps for mobile devices.",
    lead: "Rishi",
    initials: "R",
    image: "/images/leads/rishi.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/rishi2220/",
      instagram: "https://www.instagram.com/rishia2220/",
      website: "https://rishia.in/",
    },
    icon: Smartphone,
    color: "green",
  },
  {
    id: "ui",
    title: "UI",
    description: "Interface design and user experience.",
    lead: "Kaushik",
    initials: "K",
    image: "/images/leads/kaushik.jpg",
    icon: PanelsTopLeft,
    color: "yellow",
  },
  {
    id: "wit",
    title: "Women in Tech",
    description: "Connections and support for women in tech.",
    lead: "Rydham",
    initials: "R",
    image: "/images/leads/rydham.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/rydham-rydham-932094376/",
      instagram: "https://www.instagram.com/rydham._.77/",
    },
    icon: HeartHandshake,
    color: "red",
  },
  {
    id: "ai",
    title: "AI",
    description: "AI models and applications.",
    lead: "Kartik Sirohi",
    initials: "KS",
    image: "/images/leads/kartik.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/kartik-sirohi-b81625325/",
      instagram: "https://www.instagram.com/kartiksirohi12/",
      website: "https://sirohikartik.github.io/",
    },
    icon: BrainCircuit,
    color: "blue",
  },
  {
    id: "cp",
    title: "Competitive Programming",
    description: "Algorithms and problem solving.",
    lead: "Kavish",
    initials: "K",
    image: "/images/leads/kavish.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/kavish0024/",
      instagram: "https://www.instagram.com/kavish_0024/",
    },
    icon: Braces,
    color: "yellow",
  },
  {
    id: "devsecops",
    title: "DevSecOps",
    description: "Infrastructure and software delivery.",
    lead: "Sushobhit",
    initials: "S",
    image: "/images/leads/sushobhit.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/sushobhit-goyal-xdxd/",
      instagram: "https://www.instagram.com/sushobhitxd/",
    },
    icon: CloudCog,
    color: "green",
  },
];

export const galleryMoments: GalleryMoment[] = [
  { id: "campus", caption: "Campus community" },
  { id: "workshops", caption: "Workshops" },
  { id: "building", caption: "Hackathons" },
  { id: "community", caption: "Team meetups" },
  { id: "moments", caption: "Event moments" },
];

// These answers give next steps. Confirm membership and event policies before adding them.
export const commonQuestions = [
  {
    question: "How do I join GDGC NITJ?",
    answer: "Contact the chapter on Instagram for the current joining process and recruitment updates.",
  },
  {
    question: "Who can join the chapter?",
    answer: "Contact the team to check the current membership requirements. For an event, check the eligibility details in its announcement.",
  },
  {
    question: "What if I’m new to a domain?",
    answer: "Find the department lead in the grid above. Contact the chapter to discuss where to start and which skills to learn.",
  },
  {
    question: "How do I register for an event?",
    answer: "Check the event announcement for registration instructions. Follow the chapter on Instagram for upcoming event updates.",
  },
  {
    question: "How can I contribute to a club project?",
    answer: "Explore the chapter’s GitHub repositories. Check the project’s README for setup and contribution details.",
  },
];
export const communityPhoto: string | undefined = undefined;
