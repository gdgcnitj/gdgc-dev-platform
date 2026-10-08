import { Globe, Instagram, Linkedin } from "lucide-react";
import { type ProfileLinks as Links } from "@/lib/content/home";

const profiles: { key: keyof Links; label: string; icon: typeof Globe }[] = [
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "website", label: "Portfolio", icon: Globe },
];

export function ProfileLinks({ name, links }: { name: string; links?: Links }) {
  return (
    <ul className="club-lead-links" aria-label={`${name} online`}>
      {profiles.map(({ key, label, icon: Icon }) => {
        const href = links?.[key];
        if (key === "website" && !href) return null;
        return (
          <li key={key}>
            {href ? (
              <a href={href} target="_blank" rel="noreferrer" aria-label={`${name}'s ${label}`}>
                <Icon size={16} aria-hidden="true" />
              </a>
            ) : (
              <span title={`${label} coming soon`}>
                <Icon size={16} aria-hidden="true" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
