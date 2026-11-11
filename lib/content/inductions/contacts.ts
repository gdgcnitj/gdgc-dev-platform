// Numbers applicants can call or message on WhatsApp after they submit.
// Keyed by domain id; the lead's name and photo come from `lib/content/home.ts`.
export const leadPhones: Record<string, string> = {
  web: "+91 90266 17496",
  ai: "+91 79064 43460",
  ui: "+91 93117 06822",
  cp: "+91 78146 69417",
  mobile: "+91 99159 72220",
  wit: "+91 98761 51559",
  devsecops: "+91 90415 79914",
  creatives: "+91 83606 90411",
};

export const chapterContacts = [
  { id: "anshuman", name: "Anshuman", phone: "+91 74040 35550" },
  { id: "ayush", name: "Ayush", phone: "+91 88376 98491" },
  { id: "prachi", name: "Prachi", phone: "+91 83540 08000" },
];

export const connectGroupUrl =
  "https://chat.whatsapp.com/LUpcSKgfWb585bcOwHdO6w?s=cl&p=a&iam=2";

const digits = (phone: string) => phone.replace(/\D/g, "");
export const telHref = (phone: string) => `tel:+${digits(phone)}`;
export const whatsappHref = (phone: string) => `https://wa.me/${digits(phone)}`;
