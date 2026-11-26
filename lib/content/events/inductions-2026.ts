import { defineEvent } from "@/lib/events/schema";

export const inductions = defineEvent({
  id: "inductions-2026",
  slug: "inductions-2026",
  title: "Inductions 2026",
  kind: "induction",
  summary:
    "Students across NIT Jalandhar applied to join GDGC and met the team in person for assessments and interviews.",
  status: "completed",
  visibility: "published",
  color: "blue",
  date: { label: "November 2026", startsOn: "2026-11-20" },
  location: { mode: "in-person", name: "NIT Jalandhar" },
  media: [
    {
      id: "assessment-room",
      src: "/images/events/inductions-2026/assessment-room.webp",
      alt: "Students working on paper and laptops at long desks in a lecture hall",
      kind: "photo",
      caption: "Students working through the in-person induction round.",
    },
    {
      id: "lecture-hall",
      src: "/images/events/inductions-2026/lecture-hall.webp",
      alt: "A view from the back of the lecture hall as students work at their desks",
      kind: "photo",
      caption: "A view from the back of the lecture hall during Inductions 2026.",
    },
    {
      id: "offline-round",
      src: "/images/events/inductions-2026/offline-round.webp",
      alt: "Rows of students working quietly during the in-person round",
      kind: "photo",
      caption: "Candidates working on their assessments at NIT Jalandhar.",
    },
  ],
  coverId: "assessment-room",
  registration: {
    mode: "internal",
    form: "department-interest",
    cycleId: "inductions-2026",
    state: "closed",
    // Thursday EOD in India: the cutoff is exclusive at Friday midnight.
    closesAt: "2026-11-20T00:00:00+05:30",
  },
  sections: [
    {
      id: "recap",
      type: "story",
      title: "Inductions recap",
      navLabel: "Recap",
      paragraphs: [
        "Inductions began with an interest form. Students shared what they wanted to learn or build and chose up to two domains.",
        "Shortlisted students joined us on campus for assessments and interviews. Thank you to everyone who applied, took part, or helped run the rounds.",
      ],
    },
    {
      id: "departments",
      type: "applications",
      title: "Domain expectations",
      navLabel: "Domains",
    },
  ],
});
