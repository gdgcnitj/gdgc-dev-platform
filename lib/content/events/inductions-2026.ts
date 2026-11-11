import { defineEvent } from "@/lib/events/schema";

export const inductions = defineEvent({
  id: "inductions-2026",
  slug: "inductions-2026",
  title: "Inductions 2026",
  kind: "induction",
  summary:
    "Find your people. Build your next idea. Explore our eight domains and tell us where you’d like to contribute to GDGC NITJ.",
  status: "scheduled",
  visibility: "published",
  color: "blue",
  location: { mode: "in-person" },
  homepage: { featured: true },
  media: [
    {
      id: "invitation",
      src: "/images/events/inductions-2026.svg",
      alt: "Eight colorful creative workspaces representing the GDGC domains, connected by a shared idea",
      kind: "illustration",
      caption: "Eight domains. Plenty of ways to contribute.",
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
      navLabel: "Domains",
    },
    {
      id: "next",
      type: "list",
      style: "numbered",
      title: "What happens next",
      navLabel: "Next steps",
      items: [
        "Express your interest. Apply once and choose up to two domains, in order of preference.",
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
          question: "Can I apply to more than one domain?",
          answer:
            "Yes, up to two. You fill in your details once, choose one or two domains in order of preference, and answer a few questions for each. If you apply to one now, you can add a second later with the same email and roll number.",
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
