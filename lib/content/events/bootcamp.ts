import { defineEvent } from "@/lib/events/schema";

export const bootcamp = defineEvent({
  id: "bootcamp",
  slug: "bootcamp",
  title: "Bootcamp",
  kind: "bootcamp",
  summary:
    "Fourteen lectures on building mobile applications, from your first widgets to networking, AI inference, and signed releases.",
  status: "completed",
  visibility: "published",
  color: "yellow",
  media: [
    {
      id: "cover",
      src: "/images/events/bootcamp.jpg",
      alt: "Bootcamp event photo",
      kind: "photo",
    },
  ],
  coverId: "cover",
  registration: {
    mode: "none",
  },
  sections: [],
});
