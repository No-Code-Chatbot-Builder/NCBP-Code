import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MoveDownIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

const people = [
  {
    name: "Ibrahim Sheikh",
    role: "UI/UX/Frontend",
  },
  {
    name: "Hussain Murtaza",
    role: "AI",
  },
  {
    name: "Zohaib Azam",
    role: "Cloud/Backend",
  },
  {
    name: "Labib Asif",
    role: "Cloud/Backend",
  },
  {
    name: "Shariq Anwar",
    role: "Cloud/Backend",
  },
];

const PeopleComponent = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-10 gap-10 place-items-center">
      {people.map((person, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 items-center justify-center"
        >
          <div className="w-40 h-40 bg-card mb-6 rounded-t-full "></div>
          <h2 className="text-lg font-semibold">{person.name}</h2>
          <p className="text-muted-foreground text-sm">{person.role}</p>
        </div>
      ))}
    </div>
  );
};

const SectionCard = ({
  title,
  content,
}: {
  title: string;
  content: string | JSX.Element;
}) => {
  return (
    <Card className="max-w-xl mx-auto my-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{content}</CardDescription>
      </CardContent>
    </Card>
  );
};

const AboutPage = () => {
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
            About NoCodeBot.ai
          </p>
          <div className="flex justify-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-center leading-tight w-11/12">
              Revolutionizing GPT Development. <br />
            </h2>
          </div>
          <p className="text-md font-medium text-muted-foreground leading-normal">
            NoCodeBot.ai, a pioneering platform in AI development, empowers
            users across industries to create AI Assistants effortlessly. With a
            focus on user control, extensive customization, and comprehensive
            documentation, it stands apart in a market filled with limited
            options.
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
        <Card className="w-11/12 mt-10">
          <CardContent>
            <div className="flex justify-center">
              <div className="text-center mb-12 grid gap-4  w-11/12 my-20">
                <p className="text-sm font-semibold text-muted-foreground">
                  Our Vision
                </p>
                <div className="flex justify-center">
                  <h2 className="text-3xl lg:text-4xl font-bold text-center leading-tight w-10/12">
                    Making Responsible AI Models that will make you more
                    productive.
                  </h2>
                </div>

                <div className="flex justify-center">
                  <p className="text-md font-medium text-muted-foreground leading-normal w-10/12 lg:w-1/2 text-center">
                    Our vision at NoCodeBot.ai is to create a user-friendly,
                    no-code pipeline that opens the doors of advanced AI
                    technology to a diverse range of users, especially those
                    without extensive technical backgrounds. We believe in
                    democratizing access to AI, ensuring that our cutting-edge
                    technology serves a broader audience and fosters an
                    environment where innovation is not limited by technical
                    expertise. Our commitment lies in making AI accessible,
                    versatile, and beneficial for all, regardless of their
                    technical prowess
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <div className="text-center mb-12 grid gap-4 mt-20">
            <p className="text-sm font-semibold text-muted-foreground">
              The Team
            </p>
            <div className="flex justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-center leading-tight w-11/12">
                Meet Everyone who makes this possible.
              </h2>
            </div>

            <PeopleComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
