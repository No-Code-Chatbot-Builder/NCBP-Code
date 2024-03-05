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
        "lg:grid lg:grid-cols-2 gap-10 xl:gap-0 m-10 lg:place-items-center flex flex-col-reverse lg:w-full justify-center items-center px-4 mx-auto lg:m-0"
      )}
    >
      {/* Shading Effect: Behind the Image */}
      <div className="absolute inset-0 -z-50">
        <div className="hidden dark:block">
          <div className="absolute top-10 -left-10  w-full h-full bg-primary/10 rounded-full mix-blend-multiply  filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-10 -right-10  w-1/2  bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opactity-50 animate-blob animation-delay-2000" />
          {/* <div className="absolute -bottom-10 -right-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/20 rounded-full mix-blend-multiply  filter blur-3xl opactity-5 animate-blob animation-delay-4000" /> */}
          {/* <div className="absolute -bottom-10 -left-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/20 rounded-full mix-blend-multiply  filter blur-3xl opactity-5 animate-blob animation-delay-6000" /> */}
        </div>

        {/* <div className="w-full h-full  bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl" /> */}
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
      <div className="flex flex-col gap-4 ">
        <h1 className="text-xl lg:text-3xl font-bold">{title}</h1>
        <p className="text-sm lg:text-md leading-normal text-muted-foreground w-full lg:w-3/4">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Steps;
