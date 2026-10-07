import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroArtwork } from "@/components/home/hero-artwork";
import { MediaFrame } from "@/components/home/media-frame";
import { MotionToggle } from "@/components/home/motion-toggle";
import { Button } from "@/components/ui/button";
import { communityPhoto } from "@/lib/content/home";

export default function HomeHero() {
  return (
    <section className="club-hero-field" aria-labelledby="hero-title">
      <div className="club-hero club-container">
        <div className="club-hero-copy">
          <p className="club-eyebrow">
            <span className="club-brand-dot" />
            GDG on Campus · NIT Jalandhar
          </p>
          <h1 id="hero-title">
            Learn. Build.
            <br />
            <span>Belong.</span>
          </h1>
          <p className="club-hero-description">
            A community of students learning technology, building ideas, and growing
            together at NIT Jalandhar.
          </p>
          <div className="club-actions">
            <Button asChild className="club-button">
              <Link href="#join">
                Join the community <ArrowUpRight className="club-action-arrow" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="club-button club-button-secondary">
              <Link href="#events">
                Explore events <ArrowDown className="club-action-arrow club-arrow-down" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="club-hero-visual">
          {communityPhoto ? (
            <MediaFrame
              src={communityPhoto}
              alt="GDGC NITJ students at a campus event"
              label="Community photo"
              className="club-hero-photo"
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
            />
          ) : (
            <HeroArtwork />
          )}
          <div className="club-art-caption">
            <span className="club-brand-line" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <p>Different interests. One community.</p>
            <MotionToggle />
          </div>
        </div>
      </div>
    </section>
  );
}
