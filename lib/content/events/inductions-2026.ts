import { defineEvent } from "@/lib/events/schema";

export const inductions = defineEvent({
  id: "inductions-2026",
  slug: "inductions-2026",
  title: "Inductions 2026",
  kind: "induction",
  summary:
    "Find your people. Build your next idea. Explore our eight departments and tell us where you’d like to contribute to GDGC NITJ.",
  status: "scheduled",
  visibility: "published",
  color: "blue",
  location: { mode: "in-person" },
  homepage: { featured: true },
  media: [
    {
      id: "invitation",
      src: "/images/events/inductions-2026.svg",
      alt: "Eight colorful creative workspaces representing the GDGC departments, connected by a shared idea",
      kind: "illustration",
      caption: "Eight departments. Plenty of ways to contribute.",
    },
  ],
  registration: {
    mode: "internal",
    form: "department-interest",
    cycleId: "inductions-2026",
    state: "open",
  },
  sections: [
    {
      id: "departments",
      type: "applications",
      title: "Find your place",
      navLabel: "Departments",
    },
    {
      id: "next",
      type: "list",
      style: "numbered",
      title: "What happens next",
      navLabel: "Next steps",
      items: [
        "Express your interest. Submit a separate form for each department you’d like to join.",
        "Shortlisting. The team reviews your responses before the next round.",
        "Meet us in person. Shortlisted applicants move to an offline round or interview. Date, time, and venue will be announced.",
        "Meet the new team. We announce the induction results after the selection process.",
      ],
    },
    {
      id: "questions",
      type: "faq",
      title: "A few things to know",
      navLabel: "FAQs",
      items: [
        {
          question: "Can I apply to more than one department?",
          answer:
            "Yes. Each department has its own interest form. Your common details carry over while you move between forms in the application flow, and you submit to each department separately.",
        },
        {
          question: "Does submitting a form confirm my place?",
          answer:
            "This is an expression of interest. Shortlisting and an offline round or interview follow before the team is announced.",
        },
        {
          question: "When and where will the offline round happen?",
          answer:
            "The date, time, and venue are still being decided. We’ll share the arrangements when they are confirmed.",
        },
        {
          question: "Do I need to create an account?",
          answer:
            "No. Use your @nitj.ac.in email address on the interest form. You can review your answers before submitting.",
        },
      ],
    },
  ],
});
