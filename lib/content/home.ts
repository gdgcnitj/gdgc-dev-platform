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
  category: string;
  description?: string;
  date?: string;
  venue?: string;
  image?: string;
  href?: string;
  color: BrandColor;
};
export type Department = {
  id: string;
  title: string;
  description: string;
  lead: string;
  initials: string;
  image?: string;
  icon: LucideIcon;
  href?: string;
  color: BrandColor;
};
export type GalleryMoment = { id: string; caption: string; image?: string };

export const socialLinks = {
  instagram: "https://www.instagram.com/gdgcnitj/",
  github: "https://github.com/gdgcnitj",
  youtube: "https://www.youtube.com/@DSCNITJ",
} as const;

// Add confirmed dates and links here. An empty list shows the announcement state.
export const upcomingEvents: ClubEvent[] = [];

// Titles carried forward from the existing homepage. Photos and recaps are pending.
export const pastEvents: ClubEvent[] = [
  {
    id: "hackmol",
    title: "HackMOL",
    category: "Hackathon",
    color: "blue",
  },
  {
    id: "winterfest",
    title: "WinterFest",
    category: "Community",
    color: "green",
  },
  {
    id: "orientation",
    title: "Orientation",
    category: "On campus",
    color: "yellow",
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
    icon: PenTool,
    color: "red",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Apps for mobile devices.",
    lead: "Rishi",
    initials: "R",
    icon: Smartphone,
    color: "green",
  },
  {
    id: "ui",
    title: "UI",
    description: "Interface design and user experience.",
    lead: "Kaushik",
    initials: "K",
    icon: PanelsTopLeft,
    color: "yellow",
  },
  {
    id: "wit",
    title: "Women in Tech",
    description: "Connections and support for women in tech.",
    lead: "Rydham",
    initials: "R",
    icon: HeartHandshake,
    color: "red",
  },
  {
    id: "ai",
    title: "AI",
    description: "AI models and applications.",
    lead: "Kartik Sirohi",
    initials: "KS",
    icon: BrainCircuit,
    color: "blue",
  },
  {
    id: "cp",
    title: "Competitive Programming",
    description: "Algorithms and problem solving.",
    lead: "Kavish",
    initials: "K",
    icon: Braces,
    color: "yellow",
  },
  {
    id: "devops",
    title: "DevOps",
    description: "Infrastructure and software delivery.",
    lead: "Shushobit",
    initials: "S",
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
