"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../global/mode-toggle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { signOut } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";
import { toast } from "sonner";

type Props = {
  user?: null;
};

const Navigation = (props: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      if (username && userId && signInDetails) setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      toast(
        <div className="grid gap-2">
          <h3 className="text-lg font-bold">User Signed Out</h3>
          <p className="text-muted-foreground font-sm">
            Thank you for using NoCodeBot.ai
          </p>
        </div>
      );
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <div className="py-6 px-10 flex items-center justify-between sticky top-0 z-50 bg-transparent backdrop-blur-xl">
      <aside className="flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image
              src={"./assets/ncbai.svg"}
              width={40}
              height={40}
              alt="NoCodeBot.ai logo"
            />
            <span className="text-xl font-extrabold">NoCodeBot.ai</span>
          </div>
        </Link>
      </aside>

      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"/pricing"} className="hover:underline">
            Pricing
          </Link>
          <Link href={"/about"} className="hover:underline">
            About
          </Link>
          <Link href={"/features"} className="hover:underline">
            Features
          </Link>
          <Link href={"/dashboard/featured"} className="hover:underline">
            Dashboard
          </Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        {isLoggedIn ? (
          <Button onClick={handleSignOut}>Sign Out</Button>
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}

        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
