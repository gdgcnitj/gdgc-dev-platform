import HomeHero from "@/components/home-hero";
import { HomeDepartments } from "@/components/home/departments";
import { DepartmentStrip } from "@/components/home/department-strip";
import { HomeEvents } from "@/components/home/events";
import { HomeFooter } from "@/components/home/footer";
import { HomeGallery } from "@/components/home/gallery";
import { HomeFaq } from "@/components/home/faq";
import { HomeMotion } from "@/components/home/home-motion";

export default function Home() {
  return (
    <HomeMotion>
      <HomeHero />
      <DepartmentStrip />
      <HomeEvents />
      <HomeDepartments />
      <HomeGallery />
      <HomeFaq />
      <HomeFooter />
    </HomeMotion>
  );
}
