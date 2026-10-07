import { z } from "zod";
import { departments } from "@/lib/content/home";

// Confirm this list against the current NITJ programmes.
export const branches = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Instrumentation and Control Engineering",
  "Mechanical Engineering",
  "Industrial and Production Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Textile Technology",
  "Other",
] as const;

export const years = ["1st year", "2nd year", "3rd year", "4th year", "Postgraduate"] as const;

const departmentIds = departments.map((department) => department.id) as [string, ...string[]];

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address"))
    .refine((value) => value.endsWith("@nitj.ac.in"), "Use your @nitj.ac.in email"),
  rollNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,12}$/, "Enter your roll number"),
  branch: z.enum(branches, "Choose your branch"),
  year: z.enum(years, "Choose your year"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Enter a 10-digit Indian mobile number"),
  interests: z.array(z.enum(departmentIds)).min(1, "Choose at least one department"),
});

export type Registration = z.infer<typeof registrationSchema>;

export type RegistrationResult = { ok: true } | { ok: false; error: string };
