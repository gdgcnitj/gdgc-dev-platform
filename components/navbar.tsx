import Link from "next/link";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <SignedOut>
          <NavigationMenuItem>
            <SignInButton>
              <NavigationMenuLink asChild>
                <Link href="/sign-in">Login</Link>
              </NavigationMenuLink>
            </SignInButton>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <SignUpButton>
              <NavigationMenuLink asChild>
                <Link href="/sign-in/create">Register</Link>
              </NavigationMenuLink>
            </SignUpButton>
          </NavigationMenuItem>
        </SignedOut>
        <SignedIn>
          <NavigationMenuItem>
            <UserButton />
          </NavigationMenuItem>
        </SignedIn>
        <NavigationMenuItem>
          <ThemeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
