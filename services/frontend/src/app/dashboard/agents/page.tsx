"use client";
import CustomModel from "@/components/global/custom-model";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { useModal } from "@/providers/modal-provider";

import { Edit2, Plus } from "lucide-react";

type AssistantType = {
  name: string;
  description: string;
  owner: string;
};

const dummyAssistant: AssistantType[] = [
  {
    name: "NextJS Assistant",
    description:
      "Expert on Next.js and returns answers with high accuracy. Learn next.js from my Assistant",
    owner: "ibrahimtariqsheikh",
  },
  {
    name: "Math Assistant",
    description:
      "Trained specifically on Mathematics books for more reliable answers so you can study in peace.",
    owner: "ibrahimtariqsheikh",
  },
  {
    name: "IBA Entry Assistant",
    description:
      "Prepare for IBA Entry tests, ask for similar questions and get in with ease.",
    owner: "hussainmurtaza",
  },
];

export default function Page() {
  const { setOpen } = useModal();
  const assistantModal = (
    <CustomModel
      title="Create New Assiatant"
      subheading="Configure the assitant by filling in the details"
    >
      <div></div>
    </CustomModel>
  );
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6">
            <h1 className="text-secondary text-3xl font-bold">Assistants</h1>
            <p className="text-md text-muted-foreground">
              Assitants help you through your daily workflow tasks. Create
              custom assistants according to your personal needs and
              requirements.
            </p>
          </div>
          {/*Desktop Create Button*/}
          <Button
            size={"lg"}
            className="gap-2 hidden lg:flex"
            variant={"outline"}
            onClick={() => {
              setOpen(assistantModal);
            }}
          >
            <Plus className="w-5 h-5" />
            Create New Assistant
          </Button>
          {/*Mobile Create Button*/}
          <Button
            size={"icon"}
            variant={"outline"}
            className="lg:hidden"
            onClick={() => {
              setOpen(assistantModal);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Separator className="mt-8" />
      </section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
          {dummyAssistant.map((assistant) => (
            <Card key={assistant.name}>
              <CardHeader>
                <CardTitle>{assistant.name}</CardTitle>
                <CardDescription>{assistant.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <p>@{assistant.owner}</p>
                <Button className="w-full gap-2">
                  <Edit2 className="w-5 h-5" />
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
