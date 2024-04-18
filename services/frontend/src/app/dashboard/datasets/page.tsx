"use client";
import CreateDatasetForm from "@/components/forms/create-dataset";

import CustomSheet from "@/components/global/custom-sheet";
import CustomToast from "@/components/global/custom-toast";
import JsonIcon from "@/components/icons/json-icon";
import PdfIcon from "@/components/icons/pdf-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { deleteDataset, fetchDatasets } from "@/lib/api/dataset/service";
import { DatasetType } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  removeDataset,
  setDatasets,
} from "@/providers/redux/slice/datasetSlice";
import { useModal } from "@/providers/modal-provider";
import { Database, Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(true);
  const { setOpen } = useModal();
  const datasets = useAppSelector((state) => state.datasets.datasets);
  const workspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );
  const router = useRouter();
  const datasetSheet = (
    <CustomSheet
      title="Create New Dataset"
      description="Add data to your dataset here."
    >
      <CreateDatasetForm />
    </CustomSheet>
  );

  useEffect(() => {
    setLoader(true);
    const fetchCurrentDatasets = async () => {
      console.log(workspaceName);
      const res = await fetchDatasets(workspaceName);
      dispatch(setDatasets(res?.datasets));
    };

    fetchCurrentDatasets().finally(() => setLoader(false));
  }, [workspaceName, dispatch]);

  const handleDatasetDeletion = async (
    datasetId: string,
    datasetName: string
  ) => {
    try {
      await deleteDataset(workspaceName, datasetId);
      dispatch(removeDataset(datasetId));
      toast(
        CustomToast({
          title: `${datasetName} Deleted`,
          description: `${datasetName} has been deleted successfully.`,
        })
      );
    } catch (error) {
      toast(
        CustomToast({
          title: "Error During Deletion",
          description:
            "An error occurred while deleting the dataset. Please try again.",
        })
      );
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <h1 className="text-3xl font-bold">Datasets</h1>
            <p className="text-md text-muted-foreground hidden md:block">
              Datasets help you manage your data which you can use to configure
              your workspace. Create your personal dataset and start using it
              now.
            </p>
          </div>
          {/*Desktop Create Button*/}
          {loader && datasets.length !== 0 && (
            <Button
              size={"lg"}
              className="gap-2"
              onClick={() => {
                setOpen(datasetSheet);
              }}
            >
              <Plus className="w-5 h-5" />
              <p className="flex">
                Create <span className="hidden lg:block">&nbsp;Dataset</span>
              </p>
            </Button>
          )}
        </div>
        <Separator className="mt-8" />
      </section>
      {loader ? (
        <div className="flex justify-center items-center w-full h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <section>
          {datasets?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {datasets.map((dataset: DatasetType) => (
                <Card key={dataset.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1">
                        <CardTitle>{dataset.name}</CardTitle>
                        <CardDescription>{dataset.description}</CardDescription>
                      </div>
                      <Button
                        size="icon"
                        variant={"destructive"}
                        onClick={() => {
                          handleDatasetDeletion(dataset.id, dataset.name);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <div className="flex gap-4 px-4">
                    <PdfIcon className="w-12" />
                    <JsonIcon className="w-12" />
                  </div>
                  <CardContent>
                    <Button
                      className="w-full gap-2"
                      onClick={() => {
                        router.push(`/dashboard/datasets/${dataset.id}`);
                      }}
                    >
                      Manage Files
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="w-full h-[65vh] flex items-center justify-center">
              <div className="flex items-center justify-center">
                <div className="bg-card border border-primary p-16 rounded-lg flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-center">
                    No Datasets Available
                  </h2>

                  <p className="text-muted-foreground text-center mt-2">
                    Create a dataset to get started.
                  </p>

                  <Button
                    className="flex items-center justify-center gap-2 bg-primary p-3 rounded-lg mt-5"
                    onClick={() => {
                      setOpen(datasetSheet);
                    }}
                  >
                    <Database className="w-4 h-4" />
                    <p className="text-md font-semibold">Create Dataset</p>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
