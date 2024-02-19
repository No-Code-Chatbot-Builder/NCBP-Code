import FacebookIcon from "@/components/icons/facebook-icon";
import GoogleIcon from "@/components/icons/google-icon";
import XTwitterIcon from "@/components/icons/x-icon";
import { Button } from "@/components/ui/button";
import React from "react";

const SocialSignInButtons = () => {
  return (
    <div className="flex justify-center items-center pb-4 gap-6">
      <Button
        variant={"outline"}
        size={"icon"}
        className="bg-secondary hover:bg-secondary/50"
      >
        <GoogleIcon className="w-5 h-5" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        className="bg-secondary hover:bg-secondary/50"
      >
        <FacebookIcon className="w-5 h-5" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        className="bg-secondary hover:bg-secondary/50"
      >
        <XTwitterIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SocialSignInButtons;
