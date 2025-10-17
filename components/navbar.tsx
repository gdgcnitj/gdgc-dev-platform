"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import Image from "next/image";
import GDGCIcon from "@/app/assets/gdgc.png";
import ThemeToggle from "@/components/theme-toggle";

import ProfileIcon from "@/components/profile-icon";

import { useAuth } from "@/components/auth-provider";

export default function Navbar() {
  const session = useAuth();

  return (
    <div className="w-full flex justify-between items-center">
      <Link href="/">
        <Image className="w-[2.5rem] h-auto" src={GDGCIcon} alt="Go to home" />
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="justify-between">
          {!session.user ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/sign-in">Sign In</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <ProfileIcon username={session.user.name} />
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <ThemeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
