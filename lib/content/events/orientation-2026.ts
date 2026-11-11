import { defineEvent } from "@/lib/events/schema";

export const orientation = defineEvent({
  id: "orientation-2026",
  slug: "orientation-2026",
  title: "Orientation 2026",
  kind: "orientation",
  summary:
    "We welcomed the incoming batch to GDG on Campus NIT Jalandhar, introducing our eight specialized domains and sharing how to build, learn, and grow with the community.",
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
      src: "/images/events/orientation-2026/audience.webp",
      alt: "Students seated across the lecture theatre during Orientation 2026",
      caption: "The audience at Orientation 2026 in LT 402.",
      kind: "photo",
    },
    {
      id: "presentation",
      src: "/images/events/orientation-2026/presentation.webp",
      alt: "A presenter speaks at a lectern in front of a projected slide",
      caption: "A presentation during Orientation 2026.",
      kind: "photo",
    },
    {
      id: "on-stage",
      src: "/images/events/orientation-2026/on-stage.webp",
      alt: "A group stands at the front of the lecture theatre beside a presenter",
      caption: "On stage at Orientation 2026.",
      kind: "photo",
    },
    {
      id: "lecture-theatre",
      src: "/images/events/orientation-2026/lecture-theatre.webp",
      alt: "A wide view of the audience and seating in the lecture theatre",
      caption: "A view across the lecture theatre during the orientation.",
      kind: "photo",
    },
    {
      id: "group",
      src: "/images/events/orientation-2026/group.webp",
      alt: "A group gathers outside for a photograph after the orientation",
      caption: "A group photo after Orientation 2026.",
      kind: "photo",
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
          title: "Eight Specialized Domains",
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
