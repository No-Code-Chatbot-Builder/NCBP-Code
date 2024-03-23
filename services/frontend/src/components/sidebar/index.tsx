import React from "react";
import MenuOptions from "./menu-options";
import { sidebarOpt } from "@/lib/constants";

type Props = {
  id: string;
  type: "chatbot" | "workspace";
};

const Sidebar = async ({ id, type }: Props) => {
  return (
    <>
      {/* For Desktop */}
      <MenuOptions
        defaultOpen={true}
        id={id}
        sidebarOpt={sidebarOpt}
        type={type}
      />
      {/* For Mobile */}
      <MenuOptions id={id} sidebarOpt={sidebarOpt} type={type} />
    </>
  );
};

export default Sidebar;
