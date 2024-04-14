import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCustomAuth } from "@/providers/auth-provider";
import { IconMenu2 } from "@tabler/icons-react";

export function SignInToggle() {
  const router = useRouter();
  const { isLoggedIn, logout } = useCustomAuth();
  console.log(isLoggedIn);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <IconMenu2 className="text-secondary" />
          <span className="sr-only">User Options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/features")}>
          Features
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/about")}>
          About
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/pricing")}>
          Pricing
        </DropdownMenuItem>
        {isLoggedIn ? (
          <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/sign-in")}>
            Sign In
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
