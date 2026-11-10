import { FileDown } from "lucide-react";
import { getDepartment } from "@/lib/content/departments";
import {
  expectationsPdfHref,
  expectationsPdfName,
} from "@/lib/inductions/expectations-pdf";
import type { InductionDepartment } from "@/lib/inductions/schema";

export function ExpectationsPdfLink({
  cycleId,
  department,
  label = "PDF",
  className = "induction-pdf-link",
}: {
  cycleId: string;
  department: InductionDepartment;
  label?: string;
  className?: string;
}) {
  if (!department.expectations) return null;
  const title = getDepartment(department.id)!.inductionTitle;
  return (
    <a
      className={className}
      href={expectationsPdfHref(cycleId, department.id)}
      download={expectationsPdfName(title)}
      aria-label={`Download ${title} expectations as a PDF`}
    >
      <FileDown size={16} aria-hidden="true" /> {label}
    </a>
  );
}
