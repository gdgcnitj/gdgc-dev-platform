"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { MediaFrame } from "@/components/home/media-frame";
import { ProfileLinks } from "@/components/home/profile-links";
import { alumniByBatch, type Alumnus } from "@/lib/content/alumni";
import { departments } from "@/lib/content/home";

const fields = ["blue", "green", "yellow"] as const;
const groups = alumniByBatch();

function departmentOf(person: Alumnus) {
  return departments.find((item) => item.id === person.department);
}

function matches(person: Alumnus, query: string) {
  const department = departmentOf(person);
  return [person.name, person.role, department?.title, person.nowAt, String(person.batch)]
    .some((value) => value?.toLowerCase().includes(query));
}

function AlumniCard({ person }: { person: Alumnus }) {
  const department = departmentOf(person);
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
        <h3 className={person.pending ? "club-alumni-pending" : undefined}>{person.name}</h3>
        <p className={`club-department-label${role ? "" : " club-alumni-pending"}`}>
          <Icon size={17} aria-hidden="true" />
          <span>
            {role ?? "Role coming soon"}
            {person.session && <span className="club-alumni-session">, {person.session}</span>}
          </span>
        </p>
        {person.nowAt && <p className="club-alumni-now">@ {person.nowAt}</p>}
        {person.note && <p className="club-department-description">{person.note}</p>}
        <ProfileLinks name={person.name} links={person.links} />
      </div>
    </article>
  );
}

export function AlumniDirectory() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const results = groups
    .map((group) => ({
      ...group,
      people: search ? group.people.filter((person) => !person.pending && matches(person, search)) : group.people,
    }))
    .filter((group) => group.people.length);

  return (
    <>
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
            Past leads of the chapter: what they led here, and where they are now.
          </p>
          <div className="club-alumni-tools">
            <label className="club-alumni-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, department, or company"
                aria-label="Search alumni"
              />
            </label>
            {groups.length > 1 && (
              <nav className="club-alumni-batches" aria-label="Batches">
                {groups.map(({ batch }) => (
                  <a key={batch} href={`#class-of-${batch}`}>Class of {batch}</a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </section>
      {results.length ? (
        results.map(({ batch, people }, index) => (
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
        ))
      ) : (
        <section className="club-field club-field-soft">
          <div className="club-container club-section">
            <p className="club-title-card club-alumni-empty" role="status">
              No alumni match &ldquo;{query.trim()}&rdquo;.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
