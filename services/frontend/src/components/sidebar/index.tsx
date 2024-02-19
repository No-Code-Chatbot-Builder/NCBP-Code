import React from "react";
import MenuOptions from "./menu-options";

type Props = {
  id: string;
};

const Sidebar = async ({ id }: Props) => {
  const sidebarOpt: SidebarOption[] = [
    {
      heading: "Explore Custom Agents",
      items: [
        { name: "Featured", icon: "featured", link: "/dashboard/featured" },
        { name: "My GPT's", icon: "mygpts", link: "/dashboard/mygpts" },
      ],
    },
    {
      heading: "Categories",
      items: [
        { name: "Agents", icon: "agents", link: "/dashboard/agents" },
        { name: "Datasets", icon: "datasets", link: "/dashboard/datasets" },
        { name: "API Keys", icon: "apikeys", link: "/dashboard/apikeys" },
        { name: "Discover", icon: "discover", link: "/dashboard/discover" },
        { name: "Settings", icon: "settings", link: "/dashboard/settings" },
      ],
    },
  ];

  return (
    <>
      <MenuOptions defaultOpen={true} id={id} sidebarOpt={sidebarOpt} />
      <MenuOptions id={id} sidebarOpt={sidebarOpt} />
    </>
  );
};

export default Sidebar;
