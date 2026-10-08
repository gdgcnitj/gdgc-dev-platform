import { MediaFrame } from "@/components/home/media-frame";
import { facultyCoordinators } from "@/lib/content/home";

export function HomeFaculty() {
  return (
    <section
      id="faculty"
      className="club-field club-field-soft club-field-slant"
      aria-labelledby="faculty-title"
    >
      <div className="club-container club-section">
        <div className="club-title-card club-team-heading" data-reveal>
          <h2 id="faculty-title">Faculty coordinators.</h2>
          <p>Computer Science and Engineering, NIT Jalandhar.</p>
        </div>
        <div className="club-faculty-grid">
          {facultyCoordinators.map((person, index) => (
            <article className="club-department-card" data-tone={person.color} key={person.id}>
              <div data-reveal="portrait" data-reveal-order={index}>
                <MediaFrame
                  src={person.image}
                  alt={person.name}
                  label="Portrait coming soon"
                  initials={person.initials}
                  showLabel={false}
                  className="club-lead-photo club-faculty-photo"
                  sizes="(max-width: 700px) 50vw, 300px"
                />
              </div>
              <div className="club-lead-copy">
                <h3>
                  <a
                    className="club-lead-profile"
                    href={person.profile}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${person.name}, faculty profile`}
                  >
                    {person.name}
                  </a>
                </h3>
                <p className="club-department-description">{person.title}</p>
                <a className="club-faculty-email" href={`mailto:${person.email}`}>
                  {person.email}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
