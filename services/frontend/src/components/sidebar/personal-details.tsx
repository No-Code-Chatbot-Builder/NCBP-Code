import React from "react";
import { Avatar } from "../ui/avatar";
import { ChevronsUpDownIcon, MoreHorizontal } from "lucide-react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useCustomAuth } from "@/providers/auth-provider";

const PersonalDetails = () => {
  const { user } = useCustomAuth();

  return (
    <div className="flex gap-2 p-2 my-2 justify-between items-center">
      <div className="flex flex-row gap-4 items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>IB</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          {user?.preferred_username ? (
            <h3 className="font-semibold">{user?.preferred_username}</h3>
          ) : (
            <div className="w-44 h-5 bg-card rounded-lg animate-pulse" />
          )}
          {user?.email ? (
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          ) : (
            <div className="w-44 h-3 bg-card rounded-lg animate-pulse mt-1" />
          )}
        </div>
      </div>
      {user && <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />}
    </div>
  );
};

export default PersonalDetails;
