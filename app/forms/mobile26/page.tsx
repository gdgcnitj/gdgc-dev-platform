import type { Metadata } from "next";
import { AppDevResponseForm } from "@/components/app-dev/response-form";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";

export const metadata: Metadata = {
  title: "App Dev · GDGC NITJ",
  robots: { index: false, follow: false },
};

export default function AppDevPage() {
  return (
    <HomeMotion>
      <section className="club-hero-field" aria-labelledby="app-dev-thanks">
        <div className="club-container club-prompt-page">
          <div className="club-prompt-copy">
            <p className="club-prompt-lead">
              I&apos;m Rishi. Thanks for listening to our team&apos;s app dev presentation.
            </p>
            <h1 id="app-dev-thanks">
              <span className="club-prompt-mark">Brownie points</span>
              <span className="club-prompt-where">in inductions,</span>
              <span className="club-prompt-where">by filling this form.</span>
            </h1>
            <p>That&apos;s how you get to work with our team.</p>
            <p className="club-prompt-note">It&apos;s a small form. Name, branch, and one question.</p>
          </div>
          <AppDevResponseForm />
        </div>
      </section>
      <HomeFooter />
    </HomeMotion>
  );
}
