import { MediaFrame } from "@/components/home/media-frame";
import { departments } from "@/lib/content/home";

export function HomeDepartments() {
  return (
    <section
      id="departments"
      className="club-departments-section"
      aria-labelledby="departments-title"
    >
      <div className="club-container club-section">
        <div className="club-team-heading">
          <h2 id="departments-title">Departments & leads.</h2>
          <p>Meet the student leads across our eight departments.</p>
        </div>
        <div className="club-department-grid">
          {departments.map((department) => {
            const Icon = department.icon;
            return (
              <article
                className="club-department-card"
                data-tone={department.color}
                key={department.id}
              >
                <MediaFrame
                  src={department.image}
                  alt={department.lead}
                  label="Portrait coming soon"
                  initials={department.initials}
                  showLabel={false}
                  className="club-lead-photo"
                  sizes="(max-width: 380px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="club-lead-copy">
                  <h3>{department.lead}</h3>
                  <p className="club-department-label">
                    <Icon size={17} aria-hidden="true" />
                    <span>{department.title}</span>
                  </p>
                  <p className="club-department-description">{department.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
