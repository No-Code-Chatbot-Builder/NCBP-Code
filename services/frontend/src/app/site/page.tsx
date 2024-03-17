"use client";

import Image from "next/image";
import { Code, Database, LogIn, User } from "lucide-react";
import Link from "next/link";
import Steps from "@/components/site/steps/steps";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useCustomAuth } from "@/providers/auth-provider";
import { useTheme } from "next-themes";
import { Features } from "@/components/site/features";
import { StepCard } from "@/lib/constants";
import { IconRobot } from "@tabler/icons-react";
import { Button as MovingButton } from "@/components/ui/moving-border";

export default function Home() {
  const { logout, isLoggedIn } = useCustomAuth();
  const { theme } = useTheme();

  const SignInHeader = () => {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
      >
        <motion.div className="w-full bg-white dark:bg-primary/40 border border-neutral-100 dark:border-white/[0.2] rounded-2xl">
          <div className=" my-4 grid gap-5 place-content-center p-4">
            <div className="text-xl font-bold">Sign Up to NoCodeBot.ai</div>
            <div className="grid gap-2">
              <div className="flex flex-row rounded-full border border-neutral-200 dark:border-primary/[0.2] p-2  items-center space-x-2 bg-white dark:bg-primary/40 h-full ">
                <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-primary/60" />
              </div>
              <div className="flex flex-row rounded-full border border-neutral-200 dark:border-primary/[0.2] p-2  items-center space-x-2 bg-white dark:bg-primary/40">
                <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-primary/60" />
              </div>
              <div className="flex flex-row rounded-full border border-neutral-200 dark:border-primary/[0.2] p-2  items-center space-x-2 bg-white dark:bg-primary/40">
                <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-primary/60" />
              </div>
            </div>
            <Button className="font-bold">Sign Up</Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const AssistantHeader = () => {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
      >
        <motion.div className="w-full bg-white dark:bg-primary/40 border border-neutral-100 dark:border-white/[0.2] rounded-2xl p-4">
          <div className=" my-4 grid gap-5 place-content-center">
            <div className="text-xl font-bold">Create Assistant</div>
            <div className="flex flex-row rounded-xl border border-neutral-200 dark:border-primary/[0.2] p-2  items-center space-x-2 bg-white dark:bg-primary/40  w-[240px] lg:h-[200px] lg:w-[300px] ">
              <div className="w-full bg-gray-100 h-[130px] rounded-lg dark:bg-primary/60" />
            </div>
            <Button className="font-bold">Create Assistant</Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const DatasetHeader = () => {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
      >
        <motion.div className="w-full bg-white dark:bg-primary/40 border border-neutral-100 dark:border-white/[0.2] rounded-2xl p-4">
          <div className=" my-4 grid gap-5 place-content-center">
            <div className="text-xl font-bold">Create Dataset</div>
            <div className="flex flex-row rounded-xl border border-neutral-200 dark:border-primary/[0.2] p-2  items-center space-x-2 bg-white dark:bg-primary/40 w-[240px] lg:h-[200px] lg:w-[300px]">
              <div className="w-full bg-gray-100 h-[140px] rounded-lg dark:bg-primary/60" />
            </div>
            <Button className="font-bold">Create Dataset</Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const UseChatBotHeader = () => {
    return (
      <motion.div
        initial="initial"
        whileHover="animate"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
      >
        <motion.div className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  space-x-2 bg-white dark:bg-primary/40 items-center justify-center lg:h-[200px]">
          <Image
            src="/assets/ncbai.svg"
            alt="avatar"
            height="100"
            width="100"
            className="rounded-full h-10 w-10"
          />
          <p className="text-xs text-muted-foreground">
            Welcome to NoCodeBot.ai. How may I assist you?
          </p>
        </motion.div>
        <motion.div className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-primary/40">
          <p className="text-xs text-muted-foreground">Lets go...</p>
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-700 flex-shrink-0" />
        </motion.div>
      </motion.div>
    );
  };

  const stepCards: StepCard[] = [
    {
      title: "Sign In To NoCodeBot.ai",
      description: "Add in your details",
      header: <SignInHeader />,
      className: "w-full max-w-xs lg:max-w-lg mx-auto",
      icon: <User />,
      key: "1",
    },
    {
      title: "Create a Dataset",
      description: "Add files to your dataset.",
      header: <DatasetHeader />,
      className: "w-full max-w-xs lg:max-w-lg mx-auto",
      icon: <Database />,
      key: "2",
    },
    {
      title: "Create a Assistant",
      description: "Configure your assistant.",
      header: <AssistantHeader />,
      className: "w-full max-w-xs lg:max-w-lg mx-auto",
      icon: <Code />,
      key: "3",
    },
    {
      title: "Use your chatbot",
      description: "You are all done.",
      header: <UseChatBotHeader />,
      className: "w-full max-w-xs lg:max-w-lg mx-auto",
      icon: <IconRobot />,
      key: "4",
    },
  ];

  return (
    <>
      {/**Grid and Linear Gradient */}
      <section className="absolute inset-0 z-0">
        <div className="h-[50rem] w-full dark:bg-grid-white/[0.1] bg-grid-black/[0.1] relative flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-gradient-to-b from-[#1C65EE]/60 to-bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]" />
        </div>
      </section>
      {/**Header Section */}
      <section className="relative z-10">
        <div className="flex flex-col gap-y-5 mt-10  p-10 text-center items-center z-20 bg-clip-text">
          <MovingButton
            borderRadius="1.75rem"
            className="hidden lg:block p-3 border border-primary rounded-full text-sm bg-info text-info-foreground"
          >
            NoCodeBot.ai is currently in Development Mode.{" "}
            <Link className="underline" href={"/features"}>
              Learn More
            </Link>
          </MovingButton>

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

          <div className="hidden md:block px-4 md:px-10 mt-20">
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
      <section className="relative z-10 flex justify-center items-center flex-col gap-4 mt-4 md:mt-20 lg:gap-10">
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
              stepCard={stepCards[0]}
            />
            {/* <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-r-4 border-spacing-6 dark:border-primary  border-blue-400 right-[450px] -bottom-[250px] rounded-2xl border-dashed -z-10" /> */}
          </div>
          {/*Step 2 */}
          <div className="relative">
            <Steps
              title="Create a Dataset"
              description="  After signing up, create a dataset that will contain your
            essential data, needed to create your custom chatbot."
              stepCard={stepCards[1]}
              className="lg:order-last"
            />
            {/* <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-l-4 border-spacing-6 dark:border-primary  border-blue-400 right-[450px] -bottom-[250px] rounded-2xl border-dashed -z-10" /> */}
          </div>
          {/*Step 3 */}
          <div className="relative">
            <Steps
              title="Create an Assistant"
              description="Now, Create a Assistant, by providing necessary custom configuration depending on your individual goals and needs."
              stepCard={stepCards[2]}
            />
            {/* <div className="hidden 2xl:flex absolute w-96 h-96 bg-transparent border-t-4 border-r-4 border-spacing-6 dark:border-primary  border-blue-400 right-[450px] -bottom-[250px] rounded-2xl border-dashed -z-10" /> */}
          </div>
          {/*Step 4 */}
          <div className="relative">
            <Steps
              title="All Done! Use your Assistant now."
              description="Now you can use your assistant whenever you need it for your task.
            NoCodeBot.ai makes this process incredibily easy, all without
            writing any line of code."
              stepCard={stepCards[3]}
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
              className="rounded-lg bg-card p-6 dark:border-primary text-xs text-clip"
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
