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
        "grid grid-cols-1 xl:grid-cols-2 gap-20 m-10 place-items-center"
      )}
    >
      <div
        className={cn(
          "w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-background rounded-2xl p-10 border border-primary relative",
          className
        )}
      >
        {/* Shading Effect: Behind the Image */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 -left-10  w-52 h-52 lg:w-96 lg:h-96 bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-5 animate-blob" />
          <div className="absolute top-10 -right-10  w-52 h-52 lg:w-96 lg:h-96  bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opactity-5 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opactity-5 animate-blob animation-delay-4000" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/60 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opactity-5 animate-blob animation-delay-6000" />
        </div>
        {/* Image: In the Foreground */}
        <div className="flex justify-center items-center h-full z-10">
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
