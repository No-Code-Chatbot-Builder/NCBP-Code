import Image from "next/image";
import Link from "next/link";
import React from "react";
import AuthNavigation from "../navigation/auth-nav";
import SocialSignInButtons from "../auth/social-sign-in-buttons";

const Footer = () => {
  return (
    <div className="w-full h-[400px] bg-sidebar mt-20 overflow-hidden">
      <div className="grid grid-cols-2 gap-10 place-items-center p-10 xl:px-32 xl:pt-32">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold">NoCodeBot.ai</h1>
          <p className="text-muted-foreground">
            Welcome to NoCodeBot.ai. This is a final year project made by
            students in IBA from Karachi, Pakistan.
          </p>
          <SocialSignInButtons className="flex justify-start items-start" />
        </div>
        <div className="grid grid-cols-2 gap-4 xl:gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Our Products</h1>
            <div className="text-muted-foreground grid gap-2">
              <Link href={""} className="hover:underline">
                synew.ai
              </Link>
              <Link href={""} className="hover:underline">
                prettier.ai
              </Link>
              <Link href={""} className="hover:underline">
                tuner.ai
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Contact Us</h1>
            <div className="text-muted-foreground grid gap-2">
              <Link href={""} className="hover:underline">
                Gulshan-e-Iqbal Block 10
              </Link>
              <Link href={""} className="hover:underline">
                +92 3242238420
              </Link>
              <Link href={""} className="hover:underline">
                nocodebotai@iba.edu.pk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
