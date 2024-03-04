import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  imageLink?: string;
  title: string;
  description: string;
  className?: string;
};

const Steps = ({ imageLink, title, description, className }: Props) => {
  return (
    <div
      className={cn(
        "lg:grid lg:grid-cols-2 gap-20 m-10 lg:place-items-center flex flex-col-reverse md:w-full justify-center items-center px-4"
      )}
    >
      <div
        className={cn(
          "w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-card rounded-3xl relative",
          className
        )}
      >
        {/* Shading Effect: Behind the Image */}
        <div className="absolute inset-0 -z-50 hidden">
          <div className="hidden dark:block">
            <div className="absolute top-10 -left-10  w-52 h-52 lg:w-96 lg:h-96 bg-primary/20 rounded-full mix-blend-multiply  filter blur-3xl opacity-50 animate-blob" />
            <div className="absolute top-10 -right-10  w-52 h-52 lg:w-96 lg:h-96  bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opactity-50 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-10 -right-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/20 rounded-full mix-blend-multiply  filter blur-3xl opactity-5 animate-blob animation-delay-4000" />
            <div className="absolute -bottom-10 -left-10 w-52 h-52 lg:w-96 lg:h-96  bg-primary/20 rounded-full mix-blend-multiply  filter blur-3xl opactity-5 animate-blob animation-delay-6000" />
          </div>
        </div>
        {/* Image: In the Foreground */}
        {imageLink && (
          <div className="flex justify-center items-center h-full z-50 ">
            <Image
              src={imageLink}
              layout="responsive"
              width={350}
              height={350}
              alt="signup"
              className=""
            />
          </div>
        )}
        {/* <div className="w-full h-full  bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl" /> */}
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl lg:text-3xl font-bold">{title}</h1>
        <p className="text-sm lg:text-md leading-normal text-muted-foreground w-full">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Steps;
