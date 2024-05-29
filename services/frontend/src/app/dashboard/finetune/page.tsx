"use client";
import React, { useEffect, useState } from "react";
import CustomSheet from "@/components/global/custom-sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { AssistantType, ModelType } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import {
  AudioWaveform,
  CalendarCheck,
  CheckCircle2,
  CheckIcon,
  Gavel,
  GraduationCap,
  Loader2,
  Package,
  Plus,
  TimerIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CreateFineTuneModelForm from "@/components/forms/create-finetune-model";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAxiosSWR } from "@/lib/api/useAxiosSWR";
import {
  setIsModelLoading,
  setModels,
} from "@/providers/redux/slice/modelSlice";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import { apiClient, fetchModels } from "@/lib/api/model/service";
import useSWR from "swr";

type StatusType = "All" | "Successfull" | "Failed";

export default function Page() {
  const loader = useAppSelector((state) => state.customModel.isModelLoading);
  const models = useAppSelector((state) => state.customModel.models);
  const { setOpen } = useModal();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("All");
  const [modelSelected, setModelSelected] = useState<ModelType | null>(null);
  const isModelLoading = useAppSelector(
    (state) => state.customModel.isModelLoading
  );

  const dispatch = useAppDispatch();
  const finetuneSheet = (
    <CustomSheet
      title="Create New FineTuned Model"
      description="Configure the model by filling in the details"
    >
      <CreateFineTuneModelForm />
    </CustomSheet>
  );

  const handleCreateFinetuner = async () => {
    setOpen(finetuneSheet);
  };
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );

  // const fetcher = (url: string) => apiClient.get(url).then((res) => res);

  // const {
  //   data: res,
  //   error,
  //   isLoading,
  // } = useSWR(`/model/models?workspace_id=${currentWorkspaceName}`, fetcher);
  // console.log(res);
  useEffect(() => {
    //  dispatch(setIsModelLoading(true));
    // if (isLoading) {
    //   return;
    // }
    // if (error) {
    //   console.error(error);
    //   toast(
    //     CustomToast({
    //       title: "Error",
    //       description: "Failed to load finetuned models.",
    //     })
    //   );
    //   dispatch(setIsModelLoading(false));
    //   return;
    // }

    // console.log(res);

    const getModels = async () => {
      console.log(currentWorkspaceName);
      const res = await fetchModels(currentWorkspaceName as string);
      console.log(res);
    };

    // if (res?.data?.datasets?.length <= 0) {
    //   dispatch(setModels([]));
    //   dispatch(setIsModelLoading(false));
    //   return;
    // }
    // const newModels = res.data.datasets;
    // const currentModelNames = models
    //   .map((model: ModelType) => model.modelName)
    //   .sort();
    // const newModelNames = newModels
    //   .map((model: ModelType) => model.modelName)
    //   .sort();
    // const modelsChanged =
    //   JSON.stringify(currentModelNames) !== JSON.stringify(newModelNames);

    // if (modelsChanged) {
    //   dispatch(setModels(newModels));
    // }

    //dispatch(setIsModelLoading(false));
    getModels();
  }, [currentWorkspaceName]);

  // useEffect(() => {
  //   if (modelSelected !== null) {
  //     setModelSelected(models[0]);
  //   }
  // }, []);

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <div className="flex gap-2 items-center">
              <AudioWaveform className="w-5 h-5" />
              <h1 className="text-3xl font-bold">Fine Tuning</h1>
            </div>
            <p className="text-md text-muted-foreground hidden sm:block">
              Fine tune your models to get the most out of them. Create a new
              model or fine tune an existing one.
            </p>
          </div>
          {models.length !== 0 && (
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
              <LoadingSkeleton key={`loading-skeleton-${key}`} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <div className="flex flex-row gap-4 mb-10">
            <button
              onClick={() => setSelectedStatus("All")}
              className={cn(
                "px-4 py-2 border border-primary rounded-full text-muted-foreground transition-all text-sm",
                selectedStatus === "All" && "bg-primary/10 shadow-md"
              )}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus("Successfull")}
              className={cn(
                "px-4 py-2 border border-primary rounded-full text-muted-foreground transition-all text-sm",
                selectedStatus === "Successfull" && "bg-primary/10 shadow-md"
              )}
            >
              Successfull
            </button>
            <button
              onClick={() => setSelectedStatus("Failed")}
              className={cn(
                "px-4 py-2 border border-primary rounded-full text-muted-foreground transition-all text-sm",
                selectedStatus === "Failed" && "bg-primary/10 shadow-md"
              )}
            >
              Failed
            </button>
          </div>

          {models.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="flex flex-col">
                {models.map((model: ModelType) => {
                  const formattedDate = new Date(
                    model.createdAt
                  ).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={model.modelId}
                      className={cn(
                        "w-full h-[75px] rounded-xl flex items-center justify-between px-4 hover:bg-card mb-1",
                        modelSelected?.modelId === model.modelId
                          ? "border border-primary bg-card"
                          : ""
                      )}
                      onClick={() => setModelSelected(model)}
                    >
                      <div className="flex flex-row gap-4 items-center">
                        <p className="text-md font-semibold">
                          {" "}
                          {model.modelName}
                        </p>
                        <button className="bg-green-900/30 px-4 py-2 rounded-md font-medium flex gap-1 items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-green-500 font-medium">
                            {" "}
                            {model.status}
                          </p>
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formattedDate}
                      </p>
                    </div>
                  );
                })}
              </div>
              {modelSelected !== null ? (
                <div className="col-span-2 h-fit overflow-y-auto p-10 border-l border-primary/30">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-muted-foreground/70 font-semibold">
                      MODEL
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                      <div className="text-xl font-bold">
                        {modelSelected?.modelName}
                      </div>
                      <button className="bg-green-900/30 px-4 py-2 rounded-md font-medium flex gap-1 items-center justify-center">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <p className="text-sm text-green-500 font-medium">
                          {modelSelected?.status}
                        </p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <Package className="w-3 h-3 text-green-500" />
                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          ModelID
                        </div>
                      </div>
                      <div className="text-sm ">{modelSelected?.modelId}</div>
                    </div>
                    {/**here */}
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <AudioWaveform className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Base Model
                        </div>
                      </div>
                      <div className="text-sm ">{modelSelected?.baseModel}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Batch Size
                        </div>
                      </div>
                      <div className="text-sm ">{modelSelected?.batchSize}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <CalendarCheck className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Created At
                        </div>
                      </div>
                      <div className="text-sm ">
                        {formatDate(modelSelected?.createdAt)}
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <User className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Created By
                        </div>
                      </div>
                      <div className="text-sm ">{modelSelected?.createdBy}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <TimerIcon className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Epochs
                        </div>
                      </div>
                      <div className="text-sm ">{modelSelected?.epochs}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <Package className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Job ID
                        </div>
                      </div>
                      <div className="text-sm ">{modelSelected?.jobId}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <GraduationCap className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Learning Rate
                        </div>
                      </div>
                      <div className="text-sm ">
                        {modelSelected?.learningRate}
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <Gavel className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Purpose
                        </div>
                      </div>
                      <div className="text-sm ">{modelSelected?.purpose}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <Package className="w-3 h-3 text-green-500" />

                        <div className="text-sm text-muted-foreground/70 font-semibold">
                          Training Field ID
                        </div>
                      </div>
                      <div className="text-sm ">
                        {modelSelected?.trainingFileId}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-center justify-center h-full col-span-2 border-l border-primary/30 ">
                  <div className="text-xl font-bold">
                    Select a Model to view details
                  </div>
                  <p className="text-muted-foreground">
                    Select a model to view details. Create a new model or fine
                    tune an existing one.
                  </p>
                </div>
              )}
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
