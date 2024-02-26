import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
      <div className="flex flex-col justify-center items-center h-screen -translate-y-9">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary">
            About NoCodeBot.ai
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Revolutionizing GPT Development
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 mx-10">
          <SectionCard
            title="Our Mission"
            content="At NoCodeBot.ai, our mission is to democratize AI development. We strive to make advanced GPT technology accessible and user-friendly, enabling businesses and individuals to innovate and solve problems without needing extensive coding knowledge."
          />
          <SectionCard
            title="Our Vision"
            content="We envision a future where the power of AI and GPT models fuels creativity and problem-solving in every industry. By providing intuitive, no-code solutions, we aim to be at the forefront of AI democratization, contributing to a world where technology enhances human potential."
          />
          <SectionCard
            title="Our Values"
            content="Innovation, accessibility, and empowerment are at the core of everything we do. We believe in building tools that open up new possibilities for our users, ensuring that our products are not only powerful but also ethical and easy to use."
          />
          <SectionCard
            title="Meet the Team"
            content={
              <div>
                <p>
                  Our team is a blend of AI enthusiasts, software engineers, and
                  creative thinkers. Leading our team is Jane Doe, our CEO, with
                  a passion for AI and its potential to change the world. Our
                  CTO, John Smith, is a veteran in AI research, constantly
                  pushing the boundaries of what our tools can do. Our design
                  and development teams work tirelessly to make our vision a
                  reality, ensuring NoCodeBot.ai is not only technologically
                  advanced but also user-friendly and engaging.
                </p>
                {/* Additional team details or profiles can be added here */}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
