import {
  BrainCircuit,
  Braces,
  CloudCog,
  Code2,
  HeartHandshake,
  PanelsTopLeft,
  PenTool,
  Smartphone,
} from "lucide-react";
import type { DepartmentId } from "@/lib/content/departments";

const icons = {
  web: Code2,
  ai: BrainCircuit,
  ui: PanelsTopLeft,
  cp: Braces,
  mobile: Smartphone,
  wit: HeartHandshake,
  devsecops: CloudCog,
  creatives: PenTool,
};

export function DepartmentIcon({
  id,
  size = 26,
}: {
  id: DepartmentId;
  size?: number;
}) {
  const Icon = icons[id];
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
