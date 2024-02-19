import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { frontPageCards } from "@/lib/constants";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hidden dark:block absolute inset-0 z-0">
        <Image
          src={"/assets/lineargradient.svg"}
          layout="fill"
          alt="linear gradient backdrop"
          className="object-cover"
        />
      </section>
      <section className="dark:hidden absolute inset-0 z-0">
        <Image
          src={"/assets/lineargradientlight.svg"}
          layout="fill"
          alt="linear gradient backdrop"
          className="object-cover"
        />
      </section>
      <section className="relative z-10">
        <div className="flex flex-col gap-y-5 mt-10 py-10 text-center items-center">
          <div className="bg-[#0C2A64] p-3 border border-[#1C65EE] rounded-full text-sm text-muted-foreground">
            Want to learn how?{" "}
            <Link className="underline" href={"#"}>
              Learn More
            </Link>
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="text-5xl font-bold text-center md-text-[300px]">
              Make Custom AI Chatbots
            </h1>
          </div>
          <p className="text-muted-foreground">
            Easily create custom AI Agents according to your specific longterm
            needs <br /> no coding required
          </p>

          <Link href="/sign-in">
            <Button
              size={"lg"}
              className="w-fit flex flex-row gap-2 rounded-lg"
            >
              <LogIn />
              Get Started Now
            </Button>
          </Link>

          <div className="px-4 md:px-10">
            <Image
              src={"/assets/preview.png"}
              width={1200}
              height={1200}
              alt="preview image"
              className="rounded-2xl border border-muted lg:max-w-[1000px] hidden dark:block"
            />
            <Image
              src={"/assets/previewlight.png"}
              width={1200}
              height={1200}
              alt="preview image"
              className="rounded-2xl border border-muted lg:max-w-[1000px] dark:hidden"
            />
          </div>
        </div>
      </section>
      <section className="relative z-10 flex justify-center items-center flex-col gap-4 mt-20 md:mt-20">
        <h2 className="text-4xl text-center font-semibold text-secondary px-2">
          Make Custom GPT’s for your <br /> everyday Tasks
        </h2>
        <div className="flex items-stretch justify-center gap-4 flex-wrap mt-6 text-center max-w-5xl px-4 sm:px-6 lg:px-8">
          {frontPageCards.map((card) => (
            <Card key={card.title} className="md:flex-1">
              <CardHeader>
                <CardTitle className="text-secondary text-xl md:text-2xl">
                  {" "}
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center gap-6">
                <p className="text-muted-foreground text-sm">
                  {card.description}
                </p>
                <Link href="/sign-in">
                  <Button
                    size={"default"}
                    className="w-fit flex flex-row gap-2 rounded-lg"
                  >
                    Get Started Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="relative z-10 flex justify-center items-center flex-col gap-4 mt-20 md:mt-20">
        <h2 className="text-4xl text-center font-semibold text-secondary">
          Learn how to make your <br /> Custom AI Chatbot
        </h2>
        <div className="mt-10"></div>
      </section>
    </>
  );
}
