export const palette = {
  blue: "#4285F4",
  green: "#34A853",
  yellow: "#FBBC05",
  red: "#EA4335",
  ink: "#222222",
  paper: "#FFFFFF",
  field: "#161616",
} as const;

export type BrandColor = "blue" | "green" | "yellow" | "red";

export const brandOrder = [
  "blue",
  "green",
  "yellow",
  "red",
] as const satisfies readonly BrandColor[];
