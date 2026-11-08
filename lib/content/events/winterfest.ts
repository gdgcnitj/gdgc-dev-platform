import { defineEvent } from "@/lib/events/schema";

export const winterfest = defineEvent({
  id: "winterfest",
  slug: "winterfest",
  title: "WinterFest",
  kind: "festival",
  summary:
    "Seminars in AI, UI/UX, full-stack development, and cybersecurity. Contest winners got direct entry to HackMOL 6.0.",
  status: "completed",
  visibility: "published",
  color: "green",
  categoryLabel: "Workshops & contests",
  date: {
    label: "January–February 2025",
  },
  location: {
    mode: "in-person",
    name: "WE-1, NIT Jalandhar",
  },
  media: [
    {
      id: "cover",
      src: "/images/events/winterfest.jpg",
      alt: "WinterFest event photo",
      kind: "photo",
    },
  ],
  coverId: "cover",
  registration: {
    mode: "none",
  },
  sections: [
    {
      id: "archive",
      type: "notice",
      title: "We're Working on Bringing This Content",
      label: "Archiving in Progress",
      body: "We are currently compiling the session slide decks, workshop resources, competition recaps, and project demos from WinterFest. The complete archive covering our AI, UI/UX, full-stack web, and cybersecurity tracks will be published here shortly.",
    },
  ],
});
