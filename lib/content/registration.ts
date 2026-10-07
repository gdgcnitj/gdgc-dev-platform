import { z } from "zod";
import { departments } from "@/lib/content/home";

// B.Tech names follow the 2026–27 NIT Jalandhar seat matrix.
// The remaining entries are departments from the institute's courses page, for postgraduate students.
export const branches = [
  "Artificial Intelligence",
  "Bio Technology",
  "Centre for Energy and Environment",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science and Engineering",
  "Data Science and Engineering",
  "Electrical Engineering",
  "Electronics and Communication Engineering",
  "Electronics and VLSI Engineering",
  "Humanities and Management",
  "Industrial and Production Engineering",
  "Information Technology",
  "Instrumentation and Control Engineering",
  "Mathematics",
  "Mathematics and Computing",
  "Mechanical Engineering",
  "Physics",
  "Textile Technology",
  "Other",
] as const;

export const courses = ["B.Tech", "M.Tech", "M.Sc", "MBA", "Ph.D"] as const;

export const years = ["1st year", "2nd year", "3rd year", "4th year", "5th year or later"] as const;

const departmentIds = departments.map((department) => department.id) as [string, ...string[]];

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80, "Enter a shorter name"),
  email: z
    .string()
    .trim()
    .max(254, "Enter a shorter email address")
    .toLowerCase()
    .pipe(z.email("Enter a valid email address"))
    .refine((value) => value.endsWith("@nitj.ac.in"), "Use your @nitj.ac.in email"),
  rollNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6,12}$/, "Enter your roll number"),
  course: z.enum(courses, "Choose your course"),
  branch: z.enum(branches, "Choose your branch"),
  year: z.enum(years, "Choose your year"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Enter a 10-digit Indian mobile number"),
  interests: z
    .array(z.enum(departmentIds))
    .min(1, "Choose at least one department")
    .max(departmentIds.length, "Choose a department from the list"),
  company: z.string().max(200).optional(),
});

export type Registration = z.infer<typeof registrationSchema>;

export type RegistrationResult = { ok: true } | { ok: false; error: string };
