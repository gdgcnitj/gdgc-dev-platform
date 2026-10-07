import type { Metadata } from "next";
import { AlumniDirectory } from "@/components/alumni/alumni-directory";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";

export const metadata: Metadata = {
  title: "Alumni · GDGC NITJ",
  description: "The past leads of GDG on Campus NIT Jalandhar, what they led, and where they are now.",
};

export default function AlumniPage() {
  return (
    <HomeMotion>
      <AlumniDirectory />
      <HomeFooter />
    </HomeMotion>
  );
}
