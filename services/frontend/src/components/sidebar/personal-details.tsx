import React from "react";
import { Avatar } from "../ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const PersonalDetails = () => {
  return (
    <div className="flex gap-2 p-2 my-2 justify-between">
      <div className="flex flex-row gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>IB</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold">Ibrahim Sheikh</h3>
          <p className="text-xs text-muted-foreground">
            ibrahimsheikht@gmail.com
          </p>
        </div>
      </div>
      <MoreHorizontal />
    </div>
  );
};

export default PersonalDetails;
