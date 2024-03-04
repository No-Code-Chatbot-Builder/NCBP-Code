"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Steps from "@/components/site/steps/steps";
import { Input } from "@/components/ui/input";
import { useCustomAuth } from "@/providers/auth-provider";
import { useTheme } from "next-themes";
import { Features } from "@/components/site/features";

export default function Home() {
  const { logout, isLoggedIn } = useCustomAuth();
  const { theme } = useTheme();

  return (
    <>
      {/**Grid and Linear Gradient */}
      <section className="absolute inset-0 z-0">
        <div className="h-[50rem] w-full dark:bg-grid-white/[0.1] bg-grid-black/[0.1] relative flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gradient-to-b from-[#1C65EE]/60 to-bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]" />
        </div>
      </section>
      {/**Header Section */}
      <section className="relative z-10">
        <div className="flex flex-col gap-y-5 mt-10  p-10 text-center items-center z-20 bg-clip-text">
          <div className="hidden lg:block p-3 border border-[#1C65EE] rounded-full text-sm bg-info text-info-foreground ">
            NoCodeBot.ai is currently in Development Mode.{" "}
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
            needs - no coding required
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
              src={
                theme === "dark"
                  ? "/assets/preview.png"
                  : "/assets/previewlight.png"
              }
              width={1200}
              height={1200}
              alt="preview image"
              className="rounded-2xl border border-muted lg:max-w-[1000px] "
            />
          </div>
        </div>
      </section>
      {/**Features Section */}
      <section className="relative z-10 flex justify-center items-center flex-col gap-4 mt-20 lg:gap-10  px-4 ">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mt-10 lg:my-14 leading-tight">
          What can NoCodeBot.ai do?
        </h2>
        <Features />
      </section>
      {/**Steps Section */}
      <section className="z-10 flex-col gap-4 mt-20 justify-center px-4 xl:px-48">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mt-10 lg:my-14 leading-tight">
          Get Started Now!
        </h2>

        <div className="">
          {/*Step 1 */}
          <div className="relative">
            <Steps
              title="Sign Up"
              description="Create an account with NoCodeBot.ai by providing us your email
          address, password, date of birth and address."
              // imageLink={
              //   theme === "light"
              //     ? "/assets/signuplight.png"
              //     : "/assets/signup.png"
              // }
            />
            <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-r-4 border-spacing-6 dark:border-primary  border-blue-400 right-[450px] -bottom-[250px] rounded-2xl border-dashed -z-10" />
          </div>
          {/*Step 2 */}
          <div className="relative">
            <Steps
              title="Create a Dataset"
              description="  After signing up, create a dataset that will contain your
            essential data, needed to create your custom chatbot."
              // imageLink={
              //   theme === "light"
              //     ? "/assets/createdatasetlight.png"
              //     : "/assets/createdataset.png"
              // }
              className="lg:order-last"
            />
            <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-l-4 border-spacing-6 dark:border-primary  border-blue-400 right-[450px] -bottom-[250px] rounded-2xl border-dashed -z-10" />
          </div>
          {/*Step 3 */}
          <div className="relative">
            <Steps
              title="Create an Assistant"
              description="   Now you can use your assistant whenever you need it for your task.
            NoCodeBot.ai makes this process incredibily easy, all without
            writing any line of code."
              // imageLink={
              //   theme === "light"
              //     ? "/assets/createassistantlight.png"
              //     : "/assets/createassistant.png"
              // }
            />
            <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-r-4 border-spacing-6 dark:border-primary  border-blue-400 right-[450px] -bottom-[250px] rounded-2xl border-dashed -z-10" />
          </div>
          {/*Step 4 */}
          <div className="relative">
            <Steps
              title="All Done! Use your Assistant now."
              description="Now you can use your assistant whenever you need it for your task.
            NoCodeBot.ai makes this process incredibily easy, all without
            writing any line of code."
              // imageLink={
              //   theme === "light"
              //     ? "/assets/chatbotpagelight.png"
              //     : "/assets/chatbotpage.png"
              // }
              className="lg:order-last"
            />
          </div>
        </div>
        {/**Early Access Section */}
        <div className="grid gap-12 w-9/12 lg:w-8/12 mx-auto my-32">
          <h1 className="text-4xl font-bold text-center">
            Get Early Access and Notified On Launch Day
          </h1>
          <div className="flex gap-4">
            <Input
              placeholder="Enter your email address"
              className="rounded-lg bg-card p-6 dark:border-primary"
            />
            <Button className="rounded-lg p-6">Subscribe</Button>
          </div>
        </div>
        <div className="hidden">
          <Button onClick={logout}>Sign Out</Button>
          <div>
            {isLoggedIn ? <div>I Logged IN</div> : <div>Sorry Im Not</div>}
          </div>
        </div>
      </section>
    </>
  );
}
