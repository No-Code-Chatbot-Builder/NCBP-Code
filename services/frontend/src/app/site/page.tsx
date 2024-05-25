"use client";

import Image from "next/image";
import { Code, Database, LogIn, User } from "lucide-react";
import Link from "next/link";
import Steps from "@/components/site/steps/steps";
import { Input } from "@/components/ui/input";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useCustomAuth } from "@/providers/auth-provider";
import { useTheme } from "next-themes";
import { Features } from "@/components/site/features";
import { StepCard } from "@/lib/constants";
import { IconRobot } from "@tabler/icons-react";
import { Button as MovingButton } from "@/components/ui/moving-border";
import { useRef } from "react";

export default function Home() {
  const { logout, isLoggedIn } = useCustomAuth();
  const { theme } = useTheme();
  const previewRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: previewRef });

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);

  const isStep1inView = useInView(step1Ref, { once: true });
  const isStep2inView = useInView(step2Ref, { once: true });
  const isStep3inView = useInView(step3Ref, { once: true });
  const isStep4inView = useInView(step4Ref, { once: true });

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
        <div className="h-[50rem] w-full dark:bg-dot-white/[0.1] bg-dot-black/[0.1] relative flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-gradient-to-b from-[#1C65EE]/50 to-bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
        </div>
      </section>
      {/**Header Section */}
      <section className="relative z-10 mx-10 mt-28">
        <div className="flex flex-col gap-y-6 mt-10 p-0 lg:p-10 text-center items-center z-20 bg-clip-text">
          <MovingButton
            borderRadius="1.75rem"
            className="p-2 border border-primary rounded-full text-sm bg-info text-info-foreground"
          >
            NoCodeBot.ai is currently in Development Mode.{" "}
          </MovingButton>

          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="text-5xl lg:text-6xl font-bold text-center">
              Make Custom AI Assistants
            </h1>
          </div>
          <p className="text-muted-foreground text-md">
            Easily create custom AI Agents according to your specific longterm
            needs.
          </p>

          <Link href="/sign-in">
            <motion.button
              className="w-fit flex flex-row gap-2 rounded-lg bg-primary px-10 py-4 font-medium text-white text-sm items-center"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ bounceDamping: 10 }}
            >
              <LogIn className="w-4 h-4" />
              Get Started Now
            </motion.button>
          </Link>

          <div
            ref={previewRef}
            className="hidden md:block px-4 md:p-10 mt-20 bg-card/40 rounded-2xl border border-muted backdrop-blur-2xl dark:bg-dot-white/[0.1] bg-dot-black/[0.1] mx-10"
          >
            <Image
              src={
                theme === "dark"
                  ? "/assets/preview.png"
                  : "/assets/previewlight.png"
              }
              width={1200}
              height={1200}
              alt="preview image"
              className="rounded-2xl lg:max-w-[1000px] "
            />
          </div>
        </div>
      </section>
      {/**Features Section */}
      <section className="relative z-10 flex justify-center items-center flex-col gap-4 mt-4 md:mt-20 lg:gap-10">
        <h2 className="text-5xl font-bold text-center my-14 leading-tight px-10 text-secondary">
          What can NoCodeBot.ai do?
        </h2>
        <Features />
      </section>
      {/**Steps Section */}
      <section className="z-10 flex-col gap-4 mt-20 justify-center px-4 xl:px-48">
        <h2 className="text-5xl font-bold text-center my-14 leading-tight text-secondary">
          Get Started Now!
        </h2>

        <div className="">
          {/*Step 1 */}
          <div
            className="relative py-10 lg:py-0"
            ref={step1Ref}
            style={{
              transform: isStep1inView ? "none" : "translateX(-200px)",
              opacity: isStep1inView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <Steps
              title="Sign Up"
              description="Create an account with NoCodeBot.ai by providing us your email
          address, password, date of birth and address."
              stepCard={stepCards[0]}
            />
          </div>
          {/*Step 2 */}
          <div
            className="relative py-10 lg:py-0"
            ref={step2Ref}
            style={{
              transform: isStep2inView ? "none" : "translateX(200px)",
              opacity: isStep2inView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <Steps
              title="Create a Dataset"
              description="  After signing up, create a dataset that will contain your
            essential data, needed to create your custom chatbot."
              stepCard={stepCards[1]}
              className="md:order-last"
            />
          </div>
          {/*Step 3 */}
          <div
            className="relative py-10 lg:py-0"
            ref={step3Ref}
            style={{
              transform: isStep3inView ? "none" : "translateX(-200px)",
              opacity: isStep3inView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <Steps
              title="Create an Assistant"
              description="Now, Create a Assistant, by providing necessary custom configuration depending on your individual goals and needs."
              stepCard={stepCards[2]}
            />
          </div>
          {/*Step 4 */}
          <div
            className="relative py-10 lg:py-0"
            ref={step4Ref}
            style={{
              transform: isStep4inView ? "none" : "translateX(200px)",
              opacity: isStep4inView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <Steps
              title="All Done! Use your Assistant now."
              description="Now you can use your assistant whenever you need it for your task.
            NoCodeBot.ai makes this process incredibily easy, all without
            writing any line of code."
              stepCard={stepCards[3]}
              className="md:order-last"
            />
          </div>
        </div>
        {/**Early Access Section */}
        <div className="grid gap-12 w-9/12 lg:w-8/12 mx-auto my-32">
          <h1 className="text-5xl font-bold text-center text-secondary">
            Join the Waitlist
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
            {isLoggedIn ? <div>logged in atm</div> : <div>logged out</div>}
          </div>
        </div>
      </section>
    </>
  );
}
