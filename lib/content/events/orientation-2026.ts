import { defineEvent } from "@/lib/events/schema";

export const orientation = defineEvent({
  id: "orientation-2026",
  slug: "orientation-2026",
  title: "Orientation 2026",
  kind: "orientation",
  summary:
    "We welcomed the incoming batch to GDG on Campus NIT Jalandhar, introducing our eight specialized departments and sharing how to build, learn, and grow with the community.",
  status: "completed",
  visibility: "published",
  color: "yellow",
  date: {
    label: "16 October 2026",
    timeLabel: "5:30 pm - 8:00 pm",
    startsAt: "2026-10-16T17:30:00+05:30",
    endsAt: "2026-10-16T20:00:00+05:30",
  },
  location: {
    mode: "in-person",
    name: "LT 402",
  },
  media: [
    {
      id: "cover",
      src: "/images/events/orientation-2026.webp",
      alt: "Orientation 2026 event artwork",
      kind: "illustration",
    },
  ],
  coverId: "cover",
  registration: {
    mode: "none",
  },
  sections: [
    {
      id: "recap",
      type: "story",
      title: "A welcome to GDGC",
      paragraphs: [
        "We gathered in LT 402 to welcome the new batch of juniors, introduce the ethos of Google Developer Groups on Campus NIT Jalandhar, and open the floor to curious minds across campus.",
        "The evening was designed to give juniors a genuine look into who we are and what we build. Our chapter leads and domain mentors walked through the club's culture: a collaborative space where students learn by shipping real software, competing in hackathons, contributing to open source, and exploring emerging technology stacks.",
      ],
      cards: [
        {
          title: "Who We Are",
          description:
            "A vibrant community of passionate student developers, designers, and algorithmic problem-solvers backed by Google Developers at NIT Jalandhar.",
        },
        {
          title: "What We Do",
          description:
            "We organize flagship national hackathons like HackMOL, internal sprint contests like MiniMol, technical workshops, and real-world project incubators.",
        },
        {
          title: "Eight Specialized Departments",
          description:
            "Web, Mobile, AI/ML, Cloud & DevSecOps, Competitive Programming, UI/UX Design, Women in Tech (WiT), and Creatives & Media.",
        },
        {
          title: "How to Get Involved",
          description:
            "Structured learning roadmaps, active open-source projects, study circles, and upcoming recruitment drives for freshman talent.",
        },
      ],
    },
  ],
});
