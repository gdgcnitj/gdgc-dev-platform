import { z } from "zod";
import { branches } from "@/lib/content/registration";

export const appDevPrompt =
  "What's one problem in your everyday life that you've simply learned to live with, and how would you build an app to solve it?";

export const appDevSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Enter a shorter name"),
  branch: z.enum(branches, "Choose your branch"),
  answer: z
    .string()
    .trim()
    .min(10, "Write a little more about the problem and the app")
    .max(2000, "Keep your answer under 2000 characters"),
  // Browsers autofill a field named company. This name is not a contact field.
  leaveBlank: z.string().max(200).optional(),
});

export type AppDevResponse = z.infer<typeof appDevSchema>;

export type AppDevResult = { ok: true } | { ok: false; error: string };
