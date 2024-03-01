"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { frontPageCards } from "@/lib/constants";
import Link from "next/link";
import Steps from "@/components/site/steps/steps";
import { Input } from "@/components/ui/input";
import { useCustomAuth } from "@/providers/auth-provider";

export default function Home() {
  const { logout, isLoggedIn } = useCustomAuth();
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
          <div className="hidden lg:block p-3 border border-[#1C65EE] rounded-full text-sm bg-info text-info-foreground ">
            NoCodeBot.ai is currently in Devlopment Mode.{" "}
            <Link className="underline" href={"/features"}>
              Learn More
            </Link>
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="text-5xl lg:text-7xl font-bold text-center">
              Make Custom AI Assistants
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

          <div className="px-4 md:px-10 mt-20">
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
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-secondary my-10 leading-tight">
          Make Custom Assistant&apos;s <br />
          For Your Everyday <br />
          Tasks
        </h2>
        <div className="flex items-stretch justify-center gap-4 flex-wrap mt-6 text-center max-w-5xl px-4 sm:px-6 lg:px-8">
          {frontPageCards.map((card) => (
            <Card key={card.title} className="md:flex-1">
              <CardContent className="flex flex-col justify-center items-center gap-6">
                <CardTitle className="text-2xl pt-6"> {card.title}</CardTitle>
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

      <section className="z-10 flex-col gap-4 mt-20 justify-center px-0 xl:px-48">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-secondary my-10 lg:my-32 leading-tight">
          Learn How To Make Your <br />
          Custom AI Assistant.
        </h2>

        <div className="">
          {/*Step 1 */}
          <div className="relative">
            <Steps
              title="Sign Up"
              description="Create an account with NoCodeBot.ai by providing us your email
          address, password, date of birth and address."
              imageLink="/assets/signup.png"
            />
            <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-r-4 border-spacing-6 border-primary right-[500px] -bottom-[250px] rounded-2xl border-dashed -z-10" />
          </div>
          {/*Step 2 */}
          <div className="relative">
            <Steps
              title="Create a Dataset"
              description="  After signing up, create a dataset that will contain your
            essential data, needed to create your custom chatbot."
              imageLink="/assets/createdataset.png"
              className="md:order-last"
            />
            <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-l-4 border-spacing-6 border-primary right-[500px] -bottom-[250px] rounded-2xl border-dashed -z-10" />
          </div>
          {/*Step 3 */}
          <div className="relative">
            <Steps
              title="Create an Assistant"
              description="   Now you can use your assistant whenever you need it for your task.
            NoCodeBot.ai makes this process incredibily easy, all without
            writing any line of code."
              imageLink="/assets/createassistant.png"
            />
            <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-r-4 border-spacing-6 border-primary right-[500px] -bottom-[250px] rounded-2xl border-dashed -z-10" />
          </div>
          {/*Step 4 */}
          <div className="relative">
            <Steps
              title="All Done! Use your Assistant now."
              description="Now you can use your assistant whenever you need it for your task.
            NoCodeBot.ai makes this process incredibily easy, all without
            writing any line of code."
              imageLink="/assets/chatbotpage.png"
              className="md:order-last"
            />
          </div>
        </div>
        <div className="grid gap-12 w-9/12 lg:w-6/12 mx-auto my-32">
          <h1 className="text-4xl font-bold text-center">
            Get Early Access and Notified on the day of the Launch.
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder="Enter your email address"
              className="rounded-lg bg-card p-6 border-primary"
            />
            <Button className="rounded-lg p-6">Subscribe</Button>
          </div>
        </div>
        <div className="">
          <Button onClick={logout}>Sign Out</Button>
          <div>
            {isLoggedIn ? <div>I Logged IN</div> : <div>Sorry Im Not</div>}
          </div>
        </div>
      </section>
    </>
  );
}
