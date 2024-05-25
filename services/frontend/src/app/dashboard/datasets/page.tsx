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
import { deleteDataset } from "@/lib/api/dataset/service";
import { DatasetType } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  removeDataset,
  setDatasets,
  setIsDatasetLoading,
} from "@/providers/redux/slice/datasetSlice";
import { useModal } from "@/providers/modal-provider";
import { Database, Edit, Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { useEffect, useState } from "react";
import { useAxiosSWR } from "@/lib/api/useAxiosSWR";
import UpdateDatasetForm from "@/components/forms/update-dataset";
import CustomModel from "@/components/global/custom-model";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isDatasetLoading = useAppSelector(
    (state) => state.datasets.isDatasetLoading
  );
  const [isDatasetDeleting, setIsDatasetDeleting] = useState(false);

  const { setOpen, setClose } = useModal();
  const datasets = useAppSelector((state) => state.datasets.datasets);

  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );
  const { data: res, error } = useAxiosSWR(
    `/datasets/${currentWorkspaceName}/`
  );

  useEffect(() => {
    const fetchDataset = async () => {
      setIsDatasetLoading(true);
      // if (!currentWorkspaceName || !res) return;
      if (error) {
        console.error(error);
        toast(
          CustomToast({
            title: "Error",
            description: "Failed to load datasets.",
          })
        );
        return;
      }

      if (res?.data?.datasets.length <= 0) {
        setIsDatasetLoading(false);
        return;
      }
      const filteredDatasets = res.data.datasets.filter(
        (dataset: DatasetType) => dataset.name
      );
      console.log("sd");
      localStorage.setItem("datasets", JSON.stringify(filteredDatasets));

      const currentDatasetNames = datasets
        .map((dataset: DatasetType) => dataset.name)
        .sort();
      const newDatasetNames = filteredDatasets
        .map((dataset: DatasetType) => dataset.name)
        .sort();
      const datasetsChanged =
        JSON.stringify(currentDatasetNames) !== JSON.stringify(newDatasetNames);

      if (datasetsChanged || !filteredDatasets.length) {
        dispatch(setDatasets(filteredDatasets));
      }
    };

    const storedDatasets = localStorage.getItem("datasets");
    const parsedDatasets: DatasetType[] =
      storedDatasets != "undefined" ? JSON.parse(storedDatasets!) : null;
    if (storedDatasets != null) {
      dispatch(setDatasets(parsedDatasets));
    } else {
      fetchDataset();
    }
    dispatch(setIsDatasetLoading(false));

  }, [currentWorkspaceName]);

  const datasetSheet = (
    <CustomSheet
      title="Create New Dataset"
      description="Add data to your dataset here."
    >
      <CreateDatasetForm />
    </CustomSheet>
  );

  const deleteDatasetModel = (datasetId: string, datasetName: string) => {
    localStorage.removeItem("datasets");
    return (
      <CustomModel
        title={`Delete ${datasetName} Dataset`}
        description="Are you sure you want to delete this dataset?"
      >
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            onClick={() => {
              setClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => {
              setClose();
              handleDatasetDeletion(datasetId, datasetName);
            }}
          >
            Delete
          </Button>
        </div>
      </CustomModel>
    );
  };

  const handleDatasetDeletion = async (
    datasetId: string,
    datasetName: string
  ) => {
    setIsDatasetDeleting(true);

    try {
      await deleteDataset(currentWorkspaceName!, datasetId);
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
    } finally {
      setIsDatasetDeleting(false);
    }
  };

  if (isDatasetDeleting) {
    return (
      <div className="h-screen flex w-full items-center justify-center">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lg font-semibold animate-pulse">
            Deleting Dataset....
          </p>
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <div className="flex gap-2 items-center">
              <Database className="w-5 h-5" />
              <h1 className="text-3xl font-bold">Datasets</h1>
            </div>
            <p className="text-md text-muted-foreground hidden md:block">
              Datasets help you manage your data which you can use to configure
              your workspace. Create your personal dataset and start using it
              now.
            </p>
          </div>
          {/* {/Desktop Create Button/} */}
          {!isDatasetLoading && datasets?.length !== 0 && (
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

      {isDatasetLoading ? (
        // loading skeleton
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
            {Array.from(Array(3).keys()).map((key) => (
              <LoadingSkeleton key={key} />
            ))}
          </div>
        </section>
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
                      <div className="flex mr-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                size="icon"
                                variant={"ghost"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpen(
                                    <CustomSheet
                                      title="Update Dataset"
                                      description="Add data to your dataset here."
                                    >
                                      <UpdateDatasetForm
                                        name={dataset.name}
                                        description={dataset.description}
                                        datasetId={dataset.id}
                                      />
                                    </CustomSheet>
                                  );
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Dataset</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                size="icon"
                                variant={"ghost"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpen(
                                    deleteDatasetModel(dataset.id, dataset.name)
                                  );
                                }}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Dataset</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
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
