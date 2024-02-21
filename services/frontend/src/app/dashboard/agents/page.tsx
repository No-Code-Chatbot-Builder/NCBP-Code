"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Edit2, Plus } from "lucide-react";

type AssistantType = {
  name: string;
  description: string;
};

const dummyAssistant: AssistantType[] = [
  {
    name: "NextJS GPT",
    description:
      "Expert on Next.js and returns answers with high accuracy. Learn next.js from my GPT",
  },
  {
    name: "Math Assistant",
    description:
      "Trained Specifically on Mathematics books for more reliable answers so you can study",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-secondary text-3xl font-bold">Assistants</h1>
            <p className="text-md text-muted-foreground">
              Assitants help you through your daily workflow tasks. Create
              custom assistants according to your personal needs and
              requirements.
            </p>
          </div>
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
              <CardContent>
                <Button className="w-full gap-2">
                  <Edit2 className="w-5 h-5" />
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
