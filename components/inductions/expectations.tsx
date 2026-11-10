import { ChevronDown } from "lucide-react";
import type { InductionDepartment } from "@/lib/inductions/schema";

export function Expectations({
  department,
  headingLevel = 4,
}: {
  department: InductionDepartment;
  headingLevel?: 3 | 4;
}) {
  const content = department.expectations;
  const Heading = headingLevel === 3 ? "h3" : "h4";
  const Subheading = headingLevel === 3 ? "h4" : "h5";
  if (!content)
    return (
      <p className="induction-expectations-pending">
        Expectations will be shared soon.
      </p>
    );
  return (
    <details className="induction-expectations">
      <summary>
        View expectations <ChevronDown size={17} aria-hidden="true" />
      </summary>
      <div className="induction-expectation-content">
        {content.intro && (
          <p className="induction-track-intro">{content.intro}</p>
        )}
        {content.groups.map((group) => (
          <div key={group.title}>
            <Heading>{group.title}</Heading>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {group.sections?.map((section) => (
              <div
                className="induction-expectation-subsection"
                key={section.title}
              >
                <Subheading>{section.title}</Subheading>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
        {content.tracks && (
          <div className="induction-tracks">
            {content.tracksIntro && (
              <p className="induction-track-intro">{content.tracksIntro}</p>
            )}
            {content.tracks.map((track) => (
              <div key={track.title}>
                <Heading>{track.title}</Heading>
                <ul>
                  {track.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
