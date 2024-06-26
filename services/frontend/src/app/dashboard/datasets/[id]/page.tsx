"use client";

import AddDataToDatasetForm from "@/components/forms/add-data-to-dataset-form";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteData,
  deleteDataset,
  fetchFiles,
} from "@/lib/api/dataset/service";
import { DataBucketType } from "@/lib/constants";

import { useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import {
  removeDataset,
  removeFile,
  setFiles,
  setIsDatasetFilesEmpty,
  setIsDatasetLoading,
  updateDataset,
} from "@/providers/redux/slice/datasetSlice";
import { Database, File, Loader2, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { useAxiosSWR } from "@/lib/api/useAxiosSWR";
import CustomModel from "@/components/global/custom-model";

type Props = {
  params: {
    id: string;
  };
};

const DatasetByIdPage = ({ params }: Props) => {
  const dispatch = useDispatch();
  const datasetState = useAppSelector((state) => state.datasets);
  const dataset = datasetState.datasets.find(
    (set: any) => set.id === params.id
  );
  const isDatasetFilesEmpty = useAppSelector(
    (state) => state.datasets.isDatasetFilesEmpty
  );
  const { setOpen, setClose } = useModal();

  const [isDatasetDeleting, setIsDatasetDeleting] = useState(false);
  const [isDataDeleting, setIsDataDeleting] = useState(false);

  const [isDatasetFilesLoading, setIsDatasetFilesLoading] = useState(true);
  const isDatasetLoading = useAppSelector(
    (state) => state.datasets.isDatasetLoading
  );
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );
  const isWorkspaceLoading = useAppSelector(
    (state) => state.workspaces.isWorkspaceLoading
  );

  const {
    data: res,
    isLoading,
    error,
  } = useAxiosSWR(`/datasets/${currentWorkspaceName}/${params.id}`);

  useEffect(() => {
    setIsDatasetFilesLoading(true);
    if (isWorkspaceLoading || isLoading || isDatasetLoading) {
      console.log("loading....");
      return;
    }
    if (error) {
      console.error(error);
      toast(
        CustomToast({
          title: "Error",
          description: "Failed to load files.",
        })
      );
      console.log("assistants exist");
      setIsDatasetFilesLoading(false);
      return;
    }

    try {
      if (res?.data?.data?.length <= 0) {
        console.log("Data");
        dispatch(setIsDatasetFilesEmpty(true));
      } else {
        console.log("Data");
        const updatedFileArray: DataBucketType[] = res?.data?.data.map(
          (item: any) => ({
            id: item.dataId,
            name: item.name,
            path: item.path,
            createdAt: format(new Date(item.createdAt), "MM-dd-yy"),
            createdBy: item.createdBy,
          })
        );
        console.log(updatedFileArray);
        dispatch(
          setFiles({
            id: res.data.datasetDetails.datasetId,
            name: res.data.datasetDetails.name,
            description: res.data.datasetDetails.description,
            createdAt: format(
              new Date(res.data.datasetDetails.createdAt),
              "MM-dd-yy"
            ),
            createdBy: res.data.datasetDetails.createdBy,
            data: updatedFileArray,
          })
        );
        dispatch(setIsDatasetFilesEmpty(updatedFileArray.length === 0));
      }
      setIsDatasetFilesLoading(false);
    } catch (error) {
      console.error(error);
      setIsDatasetFilesLoading(false);
      dispatch(setIsDatasetFilesEmpty(true));
    }
  }, [isLoading, error, isWorkspaceLoading, isDatasetLoading]);

  const handleDataDeletion = async (dataId: string, dataName: string) => {
    try {
      setIsDataDeleting(true);
      const res = await deleteData(currentWorkspaceName!, dataset!.id, dataId);
      if (res.statusCode == 201) {
        dispatch(
          removeFile({
            datasetId: dataset!.id,
            dataId: dataId,
          })
        );
        toast(
          CustomToast({
            title: `${dataName} Deleted`,
            description: `${dataName} has been deleted successfully.`,
          })
        );
      }
    } catch (error: any) {
      toast(
        CustomToast({
          title: "Error During Deletion",
          description:
            "An error occurred while deleting the dataset. Please try again.",
        })
      );
      console.error(error);
    } finally {
      setIsDataDeleting(false);
    }
  };

  const handleDatasetDeletion = async () => {
    try {
      setIsDatasetDeleting(true);
      const res = await deleteDataset(currentWorkspaceName!, dataset!.id);
      if (res.statusCode == 201) {
        dispatch(removeDataset(dataset!.id));
        toast(
          CustomToast({
            title: `${dataset!.name} Deleted`,
            description: `${dataset!.name} has been deleted successfully.`,
          })
        );
      }
      window.location.href = "/dashboard/datasets";
    } catch (error: any) {
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

  const addDataSheet = (
    <CustomSheet title="Add Data" description="Add data to your dataset here.">
      <AddDataToDatasetForm datasetId={params.id} />
    </CustomSheet>
  );

  const deleteDatasetModel = (
    <CustomModel
      title="Delete Dataset"
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
            handleDatasetDeletion();
          }}
        >
          Delete
        </Button>
      </div>
    </CustomModel>
  );
  const deleteDataModel = (dataId: string, dataName: string) => (
    <CustomModel
      title={`Delete ${dataName}`}
      description={`Are you sure you want to delete ${dataName}?`}
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
            handleDataDeletion(dataId, dataName);
          }}
        >
          Delete
        </Button>
      </div>
    </CustomModel>
  );

  if (!dataset) {
    return (
      <div className="w-full h-screen flex items-center justify-center ">
        <div className="bg-card border border-dashed border-primary p-16 rounded-lg flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-center">No Dataset Found</h2>
          <p className="text-muted-foreground text-center mt-2">
            Load your datasets to get started
          </p>
          <Button
            className="flex items-center justify-center gap-2 bg-primary p-3 rounded-lg mt-5"
            onClick={() => {
              window.location.href = "/dashboard/datasets";
            }}
          >
            <Database className="w-4 h-4" />
            <p className="text-md font-semibold">Load Datasets</p>
          </Button>
        </div>
      </div>
    );
  }

  if (isDataDeleting) {
    return (
      <div className="h-screen flex w-full items-center justify-center">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lg font-semibold animate-pulse">
            Deleting Data...
          </p>
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      </div>
    );
  }

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
    <main className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-2 w-5/6 mr-10">
            <h1 className="text-secondary text-3xl font-bold">
              {dataset.name}
            </h1>
            <p className="text-md text-muted-foreground hidden md:block">
              <span className="font-semibold">Description:</span>{" "}
              {dataset.description}
            </p>
            <p className="text-md text-muted-foreground hidden md:block">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(dataset.createdAt).toLocaleDateString()}
            </p>
          </div>
          {!isDatasetFilesEmpty && (
            <Button
              size={"lg"}
              variant={"outline"}
              className="gap-2"
              onClick={() => {
                setOpen(addDataSheet);
              }}
            >
              <Plus className="w-5 h-5" />
              <p className="flex">Add Data</p>
            </Button>
          )}
        </div>
        <Separator className="mt-8" />
      </section>
      {isDatasetFilesLoading ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, index) => (
              <LoadingSkeleton key={index} className="h-40" />
            ))}
          </div>
        </>
      ) : (
        <>
          {isDatasetFilesEmpty ? (
            <>
              <div className="w-full h-[60vh] flex items-center justify-center ">
                <div className="bg-card border border-dashed border-primary p-16 rounded-lg flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-center">
                    No Data Found
                  </h2>
                  <p className="text-muted-foreground text-center mt-2">
                    Add Data to your dataset to get started.
                  </p>
                  <Button
                    className="flex items-center justify-center gap-2 bg-primary p-3 rounded-lg mt-5"
                    onClick={() => {
                      setOpen(addDataSheet);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <p className="text-md font-semibold">Add Data</p>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <section>
                <div className="grid gap-8">
                  <h1 className="text-2xl font-bold">Quick Access</h1>

                  {isDatasetFilesLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }, (_, index) => (
                        <LoadingSkeleton key={index} className="h-40" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {dataset.data?.map((qa: any) => (
                        <Card key={qa.id}>
                          <div className="flex justify-between items-center mr-4">
                            <CardHeader>
                              <CardTitle>{qa.name}</CardTitle>
                              <CardDescription>Description</CardDescription>
                            </CardHeader>
                            <Button
                              size="icon"
                              variant={"destructive"}
                              onClick={() => {
                                setOpen(deleteDataModel(qa.id, qa.name));
                              }}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                          <CardContent>
                            <Button className="w-full">
                              <div className="flex flex-row justify-center items-center gap-2">
                                <File className="w-4 h-4" />
                                <p>Download File</p>
                              </div>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </section>
              <section>
                <div className="grid gap-8">
                  <h1 className="text-2xl font-semibold">Recently Added</h1>
                  {isDatasetFilesLoading ? (
                    <div className="grid grid-cols-1">
                      <LoadingSkeleton className="pt-4" />
                    </div>
                  ) : (
                    <div>
                      <Card className="pt-4">
                        <CardContent>
                          <Table>
                            <TableCaption>
                              Recently added files in {dataset.name}
                            </TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-semibold">
                                  File
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Added by
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Date added
                                </TableHead>
                                <TableHead className="font-semibold"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dataset.data?.map((file: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {file.name}
                                  </TableCell>
                                  <TableCell>{file.createdBy}</TableCell>
                                  <TableCell>{file.createdAt}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
                <section className="w-full flex justify-end mt-10">
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      setOpen(deleteDatasetModel);
                    }}
                  >
                    Delete Dataset
                  </Button>
                </section>
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default DatasetByIdPage;
