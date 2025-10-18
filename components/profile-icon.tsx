"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";
import { type User } from "better-auth";

export default function ProfileIcon({ user }: { user: User }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          {user!.image && (
            <AvatarImage src={user.image} alt={`@${user.name}`} />
          )}
          <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <Button
          variant="destructive"
          onClick={async () => {
            await signOutAction();
          }}
        >
          Sign Out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
