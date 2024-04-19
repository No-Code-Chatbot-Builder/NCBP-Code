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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { Code, Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

export default function Page() {
  const isAssistantLoading = useAppSelector(
    (state) => state.assistants.isAssistantLoading
  );
  const { setOpen } = useModal();
  const assistants = useAppSelector((state) => state.assistants.assistants);
  const router = useRouter();

  const assistantSheet = (
    <CustomSheet
      title="Create New Assistant"
      description="Configure the assistant by filling in the details"
    >
      <CreateAssistantForm />
    </CustomSheet>
  );

  const handleCreateAssistant = async () => {
    setOpen(assistantSheet);
  };

  const handleAssistantDeletion = async (assistant_id : string) => {

  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <div className="flex gap-2 items-center">
              <Code className="w-7 h-7" />
              <h1 className="text-3xl font-bold">Assistants</h1>
            </div>
            <p className="text-md text-muted-foreground hidden sm:block">
              Assistants help you through your daily workflow tasks. Create
              custom assistants according to your personal needs and
              requirements.
            </p>
          </div>

          {!isAssistantLoading && assistants.length !== 0 && (
            <Button
              size={"lg"}
              className="gap-2"
              onClick={handleCreateAssistant}
            >
              <Plus className="w-5 h-5" />
              <p className="flex">
                Create <span className="hidden lg:block">&nbsp;Assistant</span>
              </p>
            </Button>
          )}
        </div>
        <Separator className="mt-8" />
      </section>
      {isAssistantLoading ? (
        // loading skeleton
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
            {Array.from(Array(4).keys()).map((key) => (
              <LoadingSkeleton key={key} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          {assistants.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
              {assistants.map((assistant: AssistantType) => (
                <Card key={assistant.id}>
                  <CardHeader>
                    <CardTitle>{assistant.name}</CardTitle>
                    <CardDescription>{assistant.description}</CardDescription>
                    <Button
                      size="icon"
                      variant={"destructive"}
                      onClick={() => {
                        handleAssistantDeletion(assistant.id);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="grid gap-3">
                    {/* <p className="text-muted-foreground">@{assistant.id}</p> */}
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
              ))}
            </div>
          ) : (
            <div className="w-full h-[65vh] flex items-center justify-center ">
              <div className="bg-card border border-dashed border-primary p-16 rounded-lg flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-center">
                  No Assistants Available
                </h2>
                <p className="text-muted-foreground text-center mt-2">
                  Create an assistant to get started.
                </p>
                <Button
                  className="flex items-center justify-center gap-2 bg-primary p-3 rounded-lg mt-5"
                  onClick={handleCreateAssistant}
                >
                  <Code className="w-4 h-4" />
                  <p className="text-md font-semibold">Create Assistant</p>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
