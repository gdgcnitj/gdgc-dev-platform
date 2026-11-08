import { RegistrationForm } from "./registration-form";
import { eventDate, registrationStatus } from "@/lib/events/helpers";
import type { ClubEvent } from "@/lib/events/schema";

const messages = {
  open: "Registration is open.",
  upcoming: "Registration opens soon.",
  waitlist: "Registration is on a waitlist.",
  closed: "Registration is closed.",
};

export function EventRegistration({ event }: { event: ClubEvent }) {
  const registration = event.registration;
  const status = registrationStatus(event);
  if (registration.mode === "none" || status === "none") return null;
  return (
    <section
      id="registration"
      className="event-content-section"
      aria-labelledby="participation-heading"
    >
      <h2 id="participation-heading">Taking part</h2>
      <div className="event-participation">
        <div>
          <p className="event-section-intro">{messages[status]}</p>
          {registration.eligibility && <p>{registration.eligibility}</p>}
          {registration.teamSize && <p>Team size: {registration.teamSize}</p>}
          {registration.fee && <p>Participation fee: {registration.fee}</p>}
        </div>
        {status === "open" && registration.mode === "internal" && (
          <RegistrationForm eventId={event.id} date={eventDate(event)} />
        )}
      </div>
    </section>
  );
}
