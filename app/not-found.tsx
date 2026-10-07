import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="club-home">
      <section className="club-hero-field" aria-labelledby="not-found-title">
        <div className="club-container club-not-found">
          <Image
            src="/images/illustrations/not-found.webp"
            alt=""
            width={1200}
            height={1200}
            sizes="(max-width: 700px) 70vw, 360px"
            className="club-not-found-art"
            priority
          />
          <p className="club-eyebrow">
            <span className="club-brand-dot" />
            Error 404
          </p>
          <h1 id="not-found-title">This page took a wrong turn.</h1>
          <p className="club-hero-description">
            The link may be old, or the page may have moved. Head back home to find events,
            departments, and people.
          </p>
          <div className="club-actions">
            <Button asChild className="club-button">
              <Link href="/">
                Back to home <ArrowRight className="club-action-arrow" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="club-button club-button-secondary">
              <Link href="/#events">See events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
