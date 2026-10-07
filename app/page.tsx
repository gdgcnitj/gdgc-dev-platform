import HomeHero from "@/components/home-hero";
import { HomeDepartments } from "@/components/home/departments";
import { HomeEvents } from "@/components/home/events";
import { HomeFooter } from "@/components/home/footer";
import { HomeGallery } from "@/components/home/gallery";
import { HomeFaq } from "@/components/home/faq";

export default function Home() {
  return (
    <div className="club-home">
      <HomeHero />
      <HomeEvents />
      <HomeDepartments />
      <HomeGallery />
      <HomeFaq />
      <HomeFooter />
    </div>
  );
}
