"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <nav
      className="club-navbar"
      aria-label="Main navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="club-nav-inner">
        <Link href="/" className="club-brand" onClick={() => setMenuOpen(false)}>
          <Image src={logo} alt="" width={38} height={30} priority />
          <span>GDGC NITJ</span>
        </Link>
        <div className="club-nav-links">
          {links.map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="club-nav-actions">
          <Button asChild className="club-nav-join">
            <Link href="/#join" onClick={() => setMenuOpen(false)}>
              Join us <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            ref={menuButton}
            type="button"
            variant="ghost"
            size="icon"
            className="club-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>
      <div id="mobile-navigation" className="club-mobile-nav" hidden={!menuOpen}>
        {links.map((link) => (
          <Link href={link.href} key={link.label} onClick={() => setMenuOpen(false)}>
            {link.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
