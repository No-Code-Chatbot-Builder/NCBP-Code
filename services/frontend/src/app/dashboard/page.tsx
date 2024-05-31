"use client";

import CreateAssistantForm from "@/components/forms/create-assistant";
import CreateDatasetForm from "@/components/forms/create-dataset";
import CreateWorkspaceForm from "@/components/forms/create-workspace";
import CustomModel from "@/components/global/custom-model";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/providers/modal-provider";

export default function Page() {
  const { setOpen } = useModal();
  const openSheet = () => {
    setOpen(
      <CustomModel
        title="Create Workspace"
        description="Create a workspace to get started."
      >
        <CreateWorkspaceForm />
      </CustomModel>
    );
  };
  const openDatasetSheet = () => {
    setOpen(
      <CustomModel
        title="Create Dataset"
        description="Create a dataset to get started."
      >
        <CreateDatasetForm />
      </CustomModel>
    );
  };
  const openAssetSheet = () => {
    setOpen(
      <CustomModel
        title="Create Assistant"
        description="Create a assistant to get started."
      >
        <CreateAssistantForm />
      </CustomModel>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-y-4 border-l dark:border-primary  border-border pl-4">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">Welcome to NoCodeBot.ai</div>
          <div>
            NoCodeBot.ai is a platform that allows you to create your own
            assistant. You can create a workspace, dataset, and assistant.
          </div>
        </div>
        <Card className="">
          <CardHeader>
            <CardTitle>Create A Workspace</CardTitle>
            <CardDescription>
              Create a workspace to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <Button onClick={openSheet}>Create Workspace</Button>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Create A Dataset</CardTitle>
            <CardDescription>Create a dataset to add data</CardDescription>
          </CardHeader>
          <CardContent className="">
            <Button onClick={openDatasetSheet}>Create Dataset</Button>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Create A Assistant</CardTitle>
            <CardDescription>
              Create a assistant to answer questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <Button onClick={openAssetSheet}>Create Assistant</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
