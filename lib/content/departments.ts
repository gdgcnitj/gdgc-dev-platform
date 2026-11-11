import type { BrandColor } from "@/lib/design/theme";

// Stable IDs are shared by the homepage, registrations, alumni, and inductions.
export const departmentCatalog = [
  {
    id: "web",
    title: "Web Development",
    inductionTitle: "Web Development",
    description: "Websites and web apps.",
    color: "blue",
  },
  {
    id: "ai",
    title: "AI",
    inductionTitle: "AI/ML",
    description: "AI models and applications.",
    color: "blue",
  },
  {
    id: "ui",
    title: "UI",
    inductionTitle: "UI/UX",
    description: "Interface design and user experience.",
    color: "yellow",
  },
  {
    id: "cp",
    title: "Competitive Programming",
    inductionTitle: "Competitive Programming",
    description: "Algorithms and problem solving.",
    color: "yellow",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    inductionTitle: "App Development",
    description: "Apps for mobile devices.",
    color: "green",
  },
  {
    id: "wit",
    title: "Women in Tech",
    inductionTitle: "Women in Tech",
    description: "Connections and support for women in tech.",
    color: "red",
  },
  {
    id: "devsecops",
    title: "DevSecOps",
    inductionTitle: "DevSecOps",
    description: "Infrastructure and software delivery.",
    color: "green",
  },
  {
    id: "creatives",
    title: "Creatives",
    inductionTitle: "Creatives",
    description: "Design, stories, and visual content.",
    color: "red",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  inductionTitle: string;
  description: string;
  color: BrandColor;
}[];

export type DepartmentId = (typeof departmentCatalog)[number]["id"];
export const departmentIds = departmentCatalog.map(
  (department) => department.id,
) as [DepartmentId, ...DepartmentId[]];

export function getDepartment(id: string) {
  return departmentCatalog.find((department) => department.id === id);
}
