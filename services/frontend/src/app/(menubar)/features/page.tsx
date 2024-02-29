import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Code2, Database, MoveDownIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-blue-500/30 dark:to-blue-400/20 to-neutral-100"></div>
);
const items = [
  {
    title: "Drag and Drop Interface",
    description:
      "Design complex systems with simplicity using an intuitive drag and drop interface.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-5 w-5 dark:text-white text-black" />,
  },
  {
    title: "Custom Assistant Creation",
    description:
      "Craft personalized assistants tailored to your unique technological needs.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-5 w-5 dark:text-white text-black" />,
  },
  {
    title: "Fine Tuning Cababilities",
    description:
      "Refine your designs with precision for optimal performance and efficiency.",
    header: <Skeleton />,
    icon: <IconSignature className="h-5 w-5 dark:text-white text-black" />,
  },
  {
    title: "Intregrated RAG Development",
    description:
      "Merge robust analytics and graphics seamlessly for impactful solutions.",
    header: <Skeleton />,
    icon: (
      <IconTableColumn
        className="h-5 w-5 dark:text-white text-black"
        text-black
      />
    ),
  },
  {
    title: "Connect Models Without Learning Code",
    description:
      "Link diverse models effortlessly without the need for coding expertise.",
    header: <Skeleton />,
    icon: <Code2 className="h-5 w-5 dark:text-white" />,
  },
  {
    title: "Personalized Datasets",
    description:
      "Build and manage personal datasets to intregrate in your custom assistants",
    header: <Skeleton />,
    icon: <Database className="h-5 w-5 dark:text-white text-black" />,
  },
  {
    title: "Manage your Workspace",
    description:
      "Organize and control your workspace for a more productive and efficient workflow.",
    header: <Skeleton />,
    icon: (
      <IconBoxAlignRightFilled className="h-5 w-5 dark:text-white text-black" />
    ),
  },
];

const FeaturesPage = () => {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center mt-10 ">
        <div className="w-full absolute inset-0 ">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={1.0}
            maxSize={2.0}
            particleDensity={100}
            className="w-full h-96"
            particleColor="#1C65EE"
          />
        </div>

        <div className="text-center mb-12 grid gap-8  w-9/12 z-10">
          <p className="text-sm font-semibold text-muted-foreground">
            Features
          </p>
          <div className="flex justify-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-center leading-tight w-11/12">
              Explore What We Have To Offer
              <br />
            </h2>
          </div>
          <p className="text-md font-medium text-muted-foreground leading-normal">
            Unleash the power of AI without the complexity of coding. Design,
            build, and deploy your AI assistant with our user-friendly, no-code
            platform.
          </p>

          <div className="flex gap-3 justify-center">
            <Button className="gap-2">
              <Video className="w-4 h-4" />
              Watch Video
            </Button>
            <Button className="gap-2" variant={"outline"}>
              Learn More
              <MoveDownIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <BentoGrid className="max-w-7xl mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};

export default FeaturesPage;
