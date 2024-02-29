import React from "react";
import { Avatar } from "../ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FetchUserAttributesOutput } from "aws-amplify/auth";

interface Props {
  userAttributes: FetchUserAttributesOutput;
}

const PersonalDetails = ({ userAttributes }: Props) => {
  return (
    <div className="flex gap-2 p-2 my-2 justify-between">
      <div className="flex flex-row gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>IB</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="font-semibold">{userAttributes.preferred_username}</h3>
          <p className="text-xs text-muted-foreground">
            {userAttributes.email}
          </p>
        </div>
      </div>
      <MoreHorizontal />
    </div>
  );
};

export default PersonalDetails;