import { defineEvent } from "@/lib/events/schema";

export const hackmol = defineEvent({
  id: "hackmol",
  slug: "hackmol",
  title: "HackMOL 7.0",
  kind: "hackathon",
  summary:
    "NIT Jalandhar's flagship 30-hour onsite hackathon. Teams from across India build real-world solutions.",
  status: "completed",
  visibility: "published",
  color: "blue",
  date: {
    label: "28–29 March 2026",
    startsOn: "2026-03-28",
    endsOn: "2026-03-29",
  },
  location: {
    mode: "in-person",
    name: "NIT Jalandhar",
  },
  media: [
    {
      id: "cover",
      src: "/images/events/hackmol7.jpg",
      alt: "HackMOL 7.0 event photo",
      kind: "photo",
    },
  ],
  coverId: "cover",
  registration: {
    mode: "none",
  },
  website: {
    label: "Visit HackMOL.com",
    url: "https://hackmol.com",
  },
  sections: [],
});
