import PricingCards from "@/components/pricing/pricing-cards";
import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <section className="flex justify-center items-center flex-col gap-4 p-4">
        <h2 className="text-4xl items-center font-semibold text-secondary">
          Choose what fits you right
        </h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          youre not ready to commit, you can get started for free.
        </p>
        <div className="flex items-center justify-center">
          <PricingCards />
        </div>
      </section>
    </div>
  );
};

export default Page;
