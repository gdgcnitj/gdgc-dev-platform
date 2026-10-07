import { Users } from "lucide-react";
import { MediaFrame } from "@/components/home/media-frame";
import { ProfileLinks } from "@/components/home/profile-links";
import { chapterLeads, departments } from "@/lib/content/home";

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
          <p>Meet the chapter&apos;s co-leads and the leads of our {departments.length} departments.</p>
        </div>
        <h3 className="club-subsection-title">Chapter co-leads</h3>
        <div className="club-department-grid club-alumni-grid">
          {chapterLeads.map((lead, index) => (
            <article className="club-department-card" data-tone={lead.color} key={lead.id}>
              <div data-reveal="portrait" data-reveal-order={index}>
                <MediaFrame
                  src={lead.image}
                  alt={lead.name}
                  label="Portrait coming soon"
                  initials={lead.initials}
                  showLabel={false}
                  className="club-lead-photo club-alumni-photo"
                  sizes="(max-width: 380px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="club-lead-copy">
                <h3>{lead.name}</h3>
                <p className="club-department-label">
                  <Users size={17} aria-hidden="true" />
                  <span>Chapter co-lead</span>
                </p>
                <ProfileLinks name={lead.name} links={lead.links} />
              </div>
            </article>
          ))}
        </div>
        <h3 className="club-subsection-title club-past-heading">Department leads</h3>
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
                  <ProfileLinks name={department.lead} links={department.links} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
