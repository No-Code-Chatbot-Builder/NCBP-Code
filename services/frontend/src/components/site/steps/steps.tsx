import { BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

import React from "react";

import { StepCard } from "@/lib/constants";

type Props = {
  title: string;
  description: string;
  className?: string;
  stepCard: StepCard;
};

const Steps = ({ title, description, className, stepCard }: Props) => {
  return (
    <div
      className={cn(
        "md:grid md:grid-cols-2 gap-10 xl:gap-0 m-10 lg:place-items-center flex flex-col-reverse md:w-full justify-center items-center px-16 mx-auto lg:m-0"
      )}
    >
      {/* Shading Effect: Behind the Image */}

      <div className="-z-50 absolute inset-0">
        {className ? (
          <div className="dark:block hidden">
            <div className="absolute top-5 right-32 w-1/4 h-full bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          </div>
        ) : (
          <div className="dark:block hidden">
            <div className="absolute top-5 left-32 w-1/4 h-full bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          </div>
        )}
      </div>
      <div className={cn("", className)}>
        <BentoGridItem
          title={stepCard.title}
          description={stepCard.description}
          header={stepCard.header}
          className={stepCard.className}
          icon={stepCard.icon}
          key={stepCard.key}
        />
      </div>
      <div className={cn("flex flex-col gap-4", className ? "lg:mx-20" : "")}>
        <h1 className="text-3xl lg:text-4xl font-bold dark:text-white text-black">
          {title}
        </h1>
        <p className="text-sm lg:text-md leading-normal text-muted-foreground w-full lg:w-full">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Steps;
