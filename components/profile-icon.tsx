"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function ProfileIcon({ username }: { username: string }) {
  const { logoutUser } = useAuth();

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar>
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <Button
          variant="destructive"
          onClick={() => {
            logoutUser();
            redirect("/");
          }}
        >
          Sign Out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
