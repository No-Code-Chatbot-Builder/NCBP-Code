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
import { AudioWaveform, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateFineTuneModelForm from "@/components/forms/create-finetune-model";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { setOpen } = useModal();
  const assistants = useAppSelector((state) => state.assistants.assistants);
  const router = useRouter();

  const finetuneSheet = (
    <CustomSheet
      title="Create New FineTuned Model"
      description="Configure the model by filling in the details"
    >
      <CreateFineTuneModelForm />
    </CustomSheet>
  );

  useEffect(() => {
    setLoader(false);
  }, []);

  const handleCreateFinetuner = async () => {
    setOpen(finetuneSheet);
  };
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <div className="flex gap-2 items-center">
              <AudioWaveform className="w-7 h-7" />
              <h1 className="text-3xl font-bold">Fine Tuning</h1>
            </div>
            <p className="text-md text-muted-foreground hidden sm:block">
              Fine tune your models to get the most out of them. Create a new
              model or fine tune an existing one.
            </p>
          </div>
          {assistants.length !== 0 && (
            <Button
              size={"lg"}
              className="gap-2"
              onClick={handleCreateFinetuner}
            >
              <Plus className="w-5 h-5" />
              <p className="flex">
                Create{" "}
                <span className="hidden lg:block">
                  &nbsp;FineTuned&nbsp;Model
                </span>
              </p>
            </Button>
          )}
        </div>
        <Separator className="mt-8" />
      </section>
      {loader ? (
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
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <p className="text-muted-foreground">@{assistant.id}</p>
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
            <div className="w-full h-[65vh] flex items-center justify-center">
              <div className="bg-card border border-dashed border-primary p-16 rounded-lg flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-center">
                  No Finetuned Models Available
                </h2>

                <p className="text-muted-foreground text-center mt-2">
                  Create a new model to get started.
                </p>

                <Button
                  className="flex items-center justify-center gap-2 bg-primary p-3 rounded-lg mt-5"
                  onClick={() => {
                    setOpen(finetuneSheet);
                  }}
                >
                  <AudioWaveform className="w-4 h-4" />
                  <p className="text-md font-semibold">
                    Create Finetuned Model
                  </p>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
