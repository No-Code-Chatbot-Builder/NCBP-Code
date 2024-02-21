import React from "react";
import MenuOptions from "./menu-options";
import { sidebarOpt } from "@/lib/constants";

type Props = {
  id: string;
};

const Sidebar = async ({ id }: Props) => {
  return (
    <>
      {/* For Desktop */}
      <MenuOptions defaultOpen={true} id={id} sidebarOpt={sidebarOpt} />
      {/* For Mobile */}
      <MenuOptions id={id} sidebarOpt={sidebarOpt} />
    </>
  );
};

export default Sidebar;
