import { departments } from "@/lib/content/home";

function StripItems() {
  return (
    <ul className="club-strip-list">
      {departments.map((department) => (
        <li key={department.id} data-tone={department.color}>
          <span className="club-tone-dot" />
          {department.title}
        </li>
      ))}
    </ul>
  );
}

export function DepartmentStrip() {
  return (
    <div className="club-strip-shell" aria-hidden="true">
      <div className="club-strip">
        <div className="club-loop club-strip-track">
          <StripItems />
          <StripItems />
        </div>
      </div>
    </div>
  );
}
