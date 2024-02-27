import React from "react";
import Navigation from "../../components/site/navigation";
import Footer from "@/components/site/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
