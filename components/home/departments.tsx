import { Globe, Instagram, Linkedin } from "lucide-react";
import { MediaFrame } from "@/components/home/media-frame";
import { departments } from "@/lib/content/home";

export function HomeDepartments() {
  return (
    <section
      id="departments"
      className="club-field club-field-yellow club-field-slant"
      aria-labelledby="departments-title"
    >
      <div className="club-container club-section">
        <div className="club-title-card club-team-heading" data-reveal>
          <h2 id="departments-title">Departments & leads.</h2>
          <p>Meet the student leads across our eight departments.</p>
        </div>
        <div className="club-department-grid">
          {departments.map((department, index) => {
            const Icon = department.icon;
            return (
              <article
                className="club-department-card"
                data-tone={department.color}
                key={department.id}
              >
                <div data-reveal="portrait" data-reveal-order={index % 4}>
                  <MediaFrame
                    src={department.image}
                    alt={department.lead}
                    label="Portrait coming soon"
                    initials={department.initials}
                    showLabel={false}
                    className="club-lead-photo"
                    sizes="(max-width: 380px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="club-lead-copy">
                  <h3>
                    {department.href ? (
                      <a className="club-lead-profile" href={department.href} aria-label={`${department.lead}, ${department.title} lead profile`}>
                        {department.lead}
                      </a>
                    ) : department.lead}
                  </h3>
                  <p className="club-department-label">
                    <Icon size={17} aria-hidden="true" />
                    <span>{department.title}</span>
                  </p>
                  <p className="club-department-description">{department.description}</p>
                  {department.links && (
                    <ul className="club-lead-links" aria-label={`${department.lead} online`}>
                      {department.links.linkedin && (
                        <li>
                          <a href={department.links.linkedin} target="_blank" rel="noreferrer" aria-label={`${department.lead} on LinkedIn`}>
                            <Linkedin size={16} aria-hidden="true" />
                          </a>
                        </li>
                      )}
                      {department.links.instagram && (
                        <li>
                          <a href={department.links.instagram} target="_blank" rel="noreferrer" aria-label={`${department.lead} on Instagram`}>
                            <Instagram size={16} aria-hidden="true" />
                          </a>
                        </li>
                      )}
                      {department.links.website && (
                        <li>
                          <a href={department.links.website} target="_blank" rel="noreferrer" aria-label={`${department.lead}'s portfolio`}>
                            <Globe size={16} aria-hidden="true" />
                          </a>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
