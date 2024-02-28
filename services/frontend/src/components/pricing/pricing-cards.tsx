import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Check } from "lucide-react";

interface Props {
  className?: string;
}

const PricingCards = ({ className }: Props) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10 mt-6 p-4",
        className
      )}
    >
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
              className={clsx("w-full text-center bg-primary p-2 rounded-md")}
            >
              Get Started
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingCards;
