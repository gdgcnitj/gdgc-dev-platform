import Image from "next/image";
import { chapterLeads } from "@/lib/content/home";
import { MessageCircle, Phone, Users } from "lucide-react";
import {
  chapterContacts,
  connectGroupUrl,
  telHref,
  whatsappHref,
} from "@/lib/content/inductions/contacts";

export type ContactPerson = {
  name: string;
  role: string;
  phone: string;
  image?: string;
  initials: string;
};

function Reach({ person }: { person: ContactPerson }) {
  return (
    <li className="induction-contact">
      {person.image ? (
        <Image
          src={person.image}
          alt=""
          width={40}
          height={40}
          className="induction-lead-photo"
        />
      ) : (
        <span className="induction-lead-photo" aria-hidden="true">
          {person.initials}
        </span>
      )}
      <p>
        <strong>{person.name}</strong>
        <span>{person.role}</span>
        <b>{person.phone}</b>
      </p>
      <span className="induction-contact-actions">
        <a
          href={telHref(person.phone)}
          aria-label={`Call ${person.name} on ${person.phone}`}
        >
          <Phone size={15} aria-hidden="true" />
          Call
        </a>
        <a
          href={whatsappHref(person.phone)}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${person.name} on ${person.phone}`}
        >
          <MessageCircle size={15} aria-hidden="true" />
          WhatsApp
        </a>
      </span>
    </li>
  );
}

export function ReceiptContacts({ leads }: { leads: ContactPerson[] }) {
  return (
    <>
      <a
        className="induction-group-card"
        href={connectGroupUrl}
        target="_blank"
        rel="noreferrer"
      >
        <Users size={20} aria-hidden="true" />
        <span>
          <strong>Join the GDGC Connect group</strong>
          <span>
            You might already be in it. If you’re not, hop on for updates.
          </span>
        </span>
        <span className="induction-group-join">Join on WhatsApp</span>
      </a>
      <section className="induction-contacts" aria-labelledby="contacts-title">
        <h3 id="contacts-title">Questions? Talk to us</h3>
        <ul>
          {leads.map((person) => (
            <Reach key={person.name} person={person} />
          ))}
        </ul>
        <p>For anything else, reach the chapter leads.</p>
        <ul>
          {chapterContacts.map(({ id, name, phone }) => {
            const lead = chapterLeads.find((item) => item.id === id);
            return (
              <Reach
                key={id}
                person={{
                  name,
                  phone,
                  role: "Chapter lead",
                  image: lead?.image,
                  initials: lead?.initials ?? name[0],
                }}
              />
            );
          })}
        </ul>
      </section>
    </>
  );
}
