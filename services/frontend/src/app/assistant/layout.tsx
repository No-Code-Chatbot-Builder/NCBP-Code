import Sidebar from "@/components/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <div className="">{children}</div>
    </div>
  );
};

export default layout;
