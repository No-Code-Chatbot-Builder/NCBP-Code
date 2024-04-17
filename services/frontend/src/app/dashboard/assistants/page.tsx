"use client";
import React, { useEffect, useState } from "react";
import CreateAssistantForm from "@/components/forms/create-assistant";
import CustomSheet from "@/components/global/custom-sheet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { AssistantType } from "@/lib/constants";
import { useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { retrieveAssistants } from "@/lib/api/bot/service";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { setOpen } = useModal();
  const assistants = useAppSelector((state) => state.assistants.assistants);
  const router = useRouter();
  const currentWorkspace = useAppSelector((state) => state.workspaces.currentWorkspaceName);

  const assistantSheet = (
    <CustomSheet
      title="Create New Assistant"
      description="Configure the assistant by filling in the details"
    >
      <CreateAssistantForm />
    </CustomSheet>
  );

  useEffect(() => {
    const fetchAssistants = async () => {
      const res = await retrieveAssistants(currentWorkspace);

    };

    // fetchAssistants();
    setLoader(false);
  }, [currentWorkspace]);


  const handleCreateAssistant = async () => {
    setOpen(assistantSheet);
  };
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <h1 className="text-secondary text-3xl font-bold">Assistants</h1>
            <p className="text-md text-muted-foreground hidden sm:block">
              Assistants help you through your daily workflow tasks. Create
              custom assistants according to your personal needs and
              requirements.
            </p>
          </div>

          <Button size={"lg"} className="gap-2" onClick={handleCreateAssistant}>
            <Plus className="w-5 h-5" />
            <p className="flex">
              Create <span className="hidden lg:block">&nbsp;Assistant</span>
            </p>
          </Button>
        </div>
        <Separator className="mt-8" />
      </section>
      {loader ?
        <div className="flex justify-center items-center w-full">
          <Loader2 className="w-20 h-20 animate-spin" />
        </div> :
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
            {assistants.length > 0 ? (
              assistants.map((assistant: AssistantType) => (
                <Card key={assistant.id}>
                  <CardHeader>
                    <CardTitle>{assistant.name}</CardTitle>
                    <CardDescription>{assistant.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <p className="text-muted-foreground">@{assistant.owner}</p>
                    <Button
                      className="w-full"
                      onClick={() => {
                        router.replace(`/assistant/${assistant.id}`);
                      }}
                    >
                      Use Assistant
                    </Button>
                  </CardContent>
                </Card>
              )
              )
            ) : (
              <p>No Assitants available. Create One</p>
            )}
          </div>
        </section>
      }
    </div>
  );
}
