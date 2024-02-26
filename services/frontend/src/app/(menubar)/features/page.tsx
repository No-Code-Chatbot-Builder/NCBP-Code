import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div></div>
      </CardContent>
    </Card>
  );
};

const Page = () => {
  return (
    <div className="h-screen p-6">
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary">
            Explore the Power of Custom GPTs with NoCodeBot.ai
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Build and fine-tune GPTs effortlessly for your specific needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Drag and Drop Interface"
            description="Easily construct your GPT models with a user-friendly drag-and-drop interface."
          />
          <FeatureCard
            title="Custom GPT Creation"
            description="Tailor GPTs to fit your unique requirements, enhancing interaction and engagement."
          />
          <FeatureCard
            title="Fine-Tuning Capabilities"
            description="Optimize your GPTs for precision and context-specific performance."
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
