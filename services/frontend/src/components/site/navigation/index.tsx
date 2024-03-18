"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../global/mode-toggle";
import { Button } from "@/components/ui/button";
import { SignInToggle } from "@/components/global/signin-toggle";
import { useCustomAuth } from "@/providers/auth-provider";

const Navigation = () => {
  const { isLoggedIn, logout } = useCustomAuth();

  return (
    <div className="py-6 px-10 flex items-center justify-between sticky top-0 z-50 bg-transparent backdrop-blur-3xl">
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
          {isLoggedIn ? (
            <Link href={"/dashboard"} className="hover:underline">
              Dashboard
            </Link>
          ) : (
            ""
          )}
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <div className="hidden md:block">
          {isLoggedIn ? (
            <Button onClick={logout}>Sign Out</Button>
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
        <div className="md:hidden block">
          <SignInToggle />
        </div>
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
