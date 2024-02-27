import FacebookIcon from "@/components/icons/facebook-icon";
import GoogleIcon from "@/components/icons/google-icon";
import XTwitterIcon from "@/components/icons/x-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

const SocialSignInButtons = ({ className }: Props) => {
  return (
    <div
      className={cn("flex justify-center items-center pb-4 gap-6", className)}
    >
      <Button
        variant={"outline"}
        size={"icon"}
        className="dark:bg-secondary hover:bg-secondary/50"
      >
        <FacebookIcon className="w-5 h-5" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        className="dark:bg-secondary hover:bg-secondary/50"
      >
        <GoogleIcon className="w-5 h-5" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        className="dark:bg-secondary hover:bg-secondary/50"
      >
        <XTwitterIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SocialSignInButtons;
