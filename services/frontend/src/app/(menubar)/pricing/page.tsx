import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import { Check } from "lucide-react";
import Link from "next/link";
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
        <div className="flex gap-4 lg:gap-10 flex-wrap mt-6 p-4">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={clsx("flex flex-col justify-between", {
                "border-2 border-primary": card.title === "Professional",
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx("w-[300px] flex flex-col justify-between", {
                    "text-secondary": card.title !== "Professional",
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription className="text-primary">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span
                  className={clsx("text-4xl font-bold", {
                    "text-muted-foreground": card.title !== "Professional",
                  })}
                >
                  {card.price}
                </span>
                <span className="text-muted-foreground">/m</span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex gap-2 items-center">
                      <Check className="text-primary" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`agency?plan=${card.priceId}`}
                  className={clsx(
                    "w-full text-center bg-primary p-2 rounded-md"
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
