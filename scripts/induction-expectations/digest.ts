import { createHash } from "node:crypto";
import { getDepartment } from "@/lib/content/departments";
import { departments } from "@/lib/content/home";
import type { InductionDepartment } from "@/lib/inductions/schema";

export type ExpectationsManifest = Record<string, string>;

export function departmentLead(id: string) {
  return departments.find((item) => item.id === id)?.lead;
}

// Everything printed in a PDF, so a content edit without a rebuild is caught by tests.
export function expectationsDigest(department: InductionDepartment) {
  return createHash("sha256")
    .update(
      JSON.stringify([
        getDepartment(department.id)?.inductionTitle,
        departmentLead(department.id),
        department.preview,
        department.expectations,
      ]),
    )
    .digest("hex");
}
