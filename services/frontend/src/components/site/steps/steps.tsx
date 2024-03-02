import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  imageLink: string;
  title: string;
  description: string;
  className?: string;
};

const Steps = ({ imageLink, title, description, className }: Props) => {
  return (
    <div
      className={cn(
        "lg:grid lg:grid-cols-2 gap-20 m-10 lg:place-items-center flex flex-col-reverse w-full justify-center items-center"
      )}
    >
      <div
        className={cn(
          "w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-background rounded-2xl p-10 border dark:border-primary border-primary/40 relative",
          className
        )}
      >
        {/* Shading Effect: Behind the Image */}
        <div className="absolute inset-0 -z-50">
          <div className="hidden dark:block">
            <div className="absolute top-10 -left-10  w-52 h-52 lg:w-96 lg:h-96 bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-5 animate-blob" />
            <div className="absolute top-10 -right-10  w-52 h-52 lg:w-96 lg:h-96  bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opactity-5 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-10 -right-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opactity-5 animate-blob animation-delay-4000" />
            <div className="absolute -bottom-10 -left-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opactity-5 animate-blob animation-delay-6000" />
          </div>
        </div>
        {/* Image: In the Foreground */}
        <div className="flex justify-center items-center h-full z-50 ">
          <Image
            src={imageLink}
            layout="responsive"
            width={350}
            height={350}
            alt="signup"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="leading-normal text-muted-foreground w-full md:w-8/12 lg:w-7/12">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Steps;
