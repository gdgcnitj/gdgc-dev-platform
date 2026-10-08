import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Github, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "@/app/assets/navbarLogo.svg";
import { Button } from "@/components/ui/button";
import { socialLinks } from "@/lib/content/home";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Events", href: "/#events" },
      { label: "Departments & leads", href: "/#departments" },
      { label: "Faculty coordinators", href: "/#faculty" },
      { label: "Gallery", href: "/#gallery" },
      { label: "Common questions", href: "/#questions" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Alumni", href: "/alumni" },
      { label: "Member sign-in", href: "/sign-in" },
      { label: "GDG chapter page", href: socialLinks.chapter },
      { label: "dsc@nitj.ac.in", href: socialLinks.email },
    ],
  },
];

export function HomeFooter() {
  return (
    <div className="club-footer-shell">
      <footer className="club-footer">
        <div className="club-container">
          <section
            id="join"
            className="club-footer-invitation"
            aria-labelledby="join-title"
            data-reveal
          >
            <h2 id="join-title">
              Join the<br />community.
            </h2>
            <div className="club-footer-invitation-copy">
              <p>Talk to the chapter about departments, events, and how to get involved.</p>
              <Button asChild className="club-button club-footer-button">
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
                  Contact on Instagram <ArrowUpRight className="club-action-arrow" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </section>
          <div className="club-footer-content">
            <div className="club-footer-identity">
              <Link href="/" className="club-brand">
                <Image src={logo} alt="" width={38} height={30} />
                <span>GDGC NITJ</span>
              </Link>
              <p>
                GDG on Campus at NIT Jalandhar.<br />
                A student community for learning and building with technology.
              </p>
              <div className="club-footer-socials" aria-label="Community channels">
                <a href={socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                  <Instagram size={20} aria-hidden="true" />
                </a>
                <a href={socialLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
                  <Linkedin size={20} aria-hidden="true" />
                </a>
                <a href={socialLinks.youtube} aria-label="YouTube" target="_blank" rel="noreferrer">
                  <Youtube size={20} aria-hidden="true" />
                </a>
                <a href={socialLinks.github} aria-label="GitHub" target="_blank" rel="noreferrer">
                  <Github size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
            <nav className="club-footer-links" aria-label="Footer">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        {link.href.startsWith("/") || link.href.startsWith("#") ? (
                          <Link href={link.href}>{link.label}</Link>
                        ) : (
                          <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="club-footer-bottom">
            <p>© {new Date().getFullYear()} GDG on Campus · NIT Jalandhar</p>
            <Link href="#main-content">
              Back to top <ArrowUp className="club-action-arrow club-arrow-up" size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
