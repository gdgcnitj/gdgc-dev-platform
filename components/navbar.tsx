"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import logo from "@/app/assets/navbarLogo.svg";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#events", label: "Events" },
  { href: "/#departments", label: "Departments" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/alumni", label: "Alumni" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const navigation = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = ["events", "departments", "gallery", "questions", "join"]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = Math.min(window.innerHeight * 0.3, 240);
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActiveSection(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!navigation.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 701px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  const current = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && activeSection === href.slice(2) ? "location" as const : undefined;
    }
    return pathname === href ? "page" as const : undefined;
  };

  return (
    <nav
      ref={navigation}
      className="club-navbar"
      aria-label="Main navigation"
    >
      <div className="club-nav-inner">
        <Link href="/" className="club-brand" onClick={() => setMenuOpen(false)}>
          <Image src={logo} alt="" width={38} height={30} priority />
          <span>GDGC NITJ</span>
        </Link>
        <div className="club-nav-links">
          {links.map((link) => (
            <Link href={link.href} key={link.label} aria-current={current(link.href)}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="club-nav-actions">
          <Button asChild className="club-nav-join">
            <Link href="/#join" aria-current={current("/#join")} onClick={() => setMenuOpen(false)}>
              Join us <ArrowUpRight className="club-action-arrow" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            ref={menuButton}
            type="button"
            variant="ghost"
            size="icon"
            className="club-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            <span className="club-menu-icons" data-open={menuOpen} aria-hidden="true">
              <Menu className="club-menu-icon" />
              <X className="club-close-icon" />
            </span>
          </Button>
        </div>
      </div>
      <div id="mobile-navigation" className="club-mobile-nav" data-open={menuOpen} inert={!menuOpen} aria-hidden={!menuOpen}>
        <div className="club-mobile-nav-clip">
          <div className="club-mobile-nav-content">
            {links.map((link) => (
              <Link href={link.href} key={link.label} aria-current={current(link.href)} onClick={() => setMenuOpen(false)}>
                {link.label}
                <ArrowUpRight className="club-action-arrow" size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
