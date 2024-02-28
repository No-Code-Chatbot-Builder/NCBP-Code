import PricingCards from "@/components/pricing/pricing-cards";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { MoveDownIcon, Video } from "lucide-react";
import React from "react";

const Page = () => {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center mt-10 ">
        <div className="w-full absolute inset-0 ">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={1.0}
            maxSize={2.0}
            particleDensity={100}
            className="w-full h-96"
            particleColor="#1C65EE"
          />
        </div>

        <div className="text-center mb-12 grid gap-8  w-9/12 z-10">
          <p className="text-sm font-semibold text-muted-foreground">Pricing</p>
          <div className="flex justify-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-center leading-tight w-11/12">
              Choose What Fits You Right
              <br />
            </h2>
          </div>
          <p className="text-md font-medium text-muted-foreground leading-normal">
            Our straightforward pricing plans are tailored to meet your needs.
            If youre not ready to commit, you can get started for free.
          </p>
        </div>
        <PricingCards />
      </div>
    </div>
  );
};

export default Page;

{
  /**   <div className="flex items-center justify-center h-screen">
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
    </div> */
}
