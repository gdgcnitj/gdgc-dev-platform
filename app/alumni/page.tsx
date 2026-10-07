import type { Metadata } from "next";
import { Users } from "lucide-react";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";
import { MediaFrame } from "@/components/home/media-frame";
import { ProfileLinks } from "@/components/home/profile-links";
import { alumniByBatch, type Alumnus } from "@/lib/content/alumni";
import { departments } from "@/lib/content/home";

export const metadata: Metadata = {
  title: "Alumni · GDGC NITJ",
  description: "The leads who built GDG on Campus NIT Jalandhar, grouped by graduating batch.",
};

const fields = ["blue", "green", "yellow"] as const;

function AlumniCard({ person }: { person: Alumnus }) {
  const department = departments.find((item) => item.id === person.department);
  const Icon = department?.icon ?? Users;
  const role = person.role ?? department?.title;

  return (
    <article
      className="club-department-card club-alumni-card"
      data-tone={department?.color ?? "blue"}
      data-reveal="card"
    >
      <MediaFrame
        src={person.image}
        alt={person.name}
        label="Portrait coming soon"
        initials={person.initials}
        showLabel={false}
        className="club-lead-photo club-alumni-photo"
        sizes="(max-width: 380px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="club-lead-copy">
        <h3>{person.name}</h3>
        {role && (
          <p className="club-department-label">
            <Icon size={17} aria-hidden="true" />
            <span>
              {role}
              {person.session && <span className="club-alumni-session">, {person.session}</span>}
            </span>
          </p>
        )}
        {person.nowAt && <p className="club-alumni-now">@ {person.nowAt}</p>}
        {person.note && <p className="club-department-description">{person.note}</p>}
        <ProfileLinks name={person.name} links={person.links} />
      </div>
    </article>
  );
}

export default function AlumniPage() {
  const groups = alumniByBatch();

  return (
    <HomeMotion>
      <section className="club-hero-field" aria-labelledby="alumni-title">
        <div className="club-container club-alumni-hero">
          <p className="club-eyebrow">
            <span className="club-brand-dot" />
            GDGC NITJ alumni
          </p>
          <h1 id="alumni-title">
            The people who <span>built this.</span>
          </h1>
          <p className="club-hero-description">
            Leads from past sessions, grouped by graduating batch. Find out what they led
            and where they are now.
          </p>
          {groups.length > 1 && (
            <nav className="club-alumni-batches" aria-label="Batches">
              {groups.map(({ batch }) => (
                <a key={batch} href={`#class-of-${batch}`}>Class of {batch}</a>
              ))}
            </nav>
          )}
        </div>
      </section>
      {groups.map(({ batch, people }, index) => (
        <section
          key={batch}
          id={`class-of-${batch}`}
          className={`club-field club-field-${fields[index % fields.length]}${index ? " club-field-slant" : ""}`}
          aria-labelledby={`class-of-${batch}-title`}
        >
          <div className="club-container club-section">
            <div className="club-title-card club-events-heading" data-reveal>
              <h2 id={`class-of-${batch}-title`}>Class of {batch}.</h2>
              <p>{people.length} {people.length === 1 ? "alumnus" : "alumni"}</p>
            </div>
            <div className="club-department-grid club-alumni-grid">
              {people.map((person) => (
                <AlumniCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        </section>
      ))}
      <HomeFooter />
    </HomeMotion>
  );
}
