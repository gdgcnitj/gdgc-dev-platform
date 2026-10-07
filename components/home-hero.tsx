import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroArtwork } from "@/components/home/hero-artwork";
import { MediaFrame } from "@/components/home/media-frame";
import { Button } from "@/components/ui/button";
import { communityPhoto } from "@/lib/content/home";

export default function HomeHero() {
  return (
    <section className="club-hero club-container" aria-labelledby="hero-title">
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
              Join the community <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="club-button club-button-secondary">
            <Link href="#events">
              Explore events <ArrowDown aria-hidden="true" />
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
        <p className="club-art-caption">
          <span className="club-brand-line" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          Different interests. One community.
        </p>
      </div>
    </section>
  );
}
