import React from "react";
import { Button } from "../ui/button";
import { PersonStanding, User } from "lucide-react";

const InviteAFriend = () => {
  return (
    <div className="flex flex-col gap-2 py-2">
      <Button className="bg-card flex justify-start gap-3 text-muted-foreground">
        <User />
        <p>Invite a friend</p>
      </Button>
    </div>
  );
};

export default InviteAFriend;
