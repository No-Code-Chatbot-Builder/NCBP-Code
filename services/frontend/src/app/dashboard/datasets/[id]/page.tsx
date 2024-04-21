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
import { fetchFiles } from "@/lib/api/dataset/service";
import { DataBucketType } from "@/lib/constants";

import { useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import {
  setIsDatasetLoading,
  updateDataset,
} from "@/providers/redux/slice/datasetSlice";
import { Code, Database, File, Plus, Trash, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

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
  const { setOpen } = useModal();

  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );
  const [isDatasetFilesLoading, setIsDatasetFilesLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataset || currentWorkspaceName === null) return;
      setIsDatasetFilesLoading(true);
      const res = await fetchFiles(currentWorkspaceName as string, params.id);
      console.log(res);
      if (!res?.data?.length) return;
      const updatedFileArray = res?.data?.map((item: any) => ({
        id: item.dataId,
        name: item.name,
        path: item.path,
        createdAt: format(new Date(item.createdAt), "MM-dd-yy"),
        createdBy: item.createdBy,
      }));
      console.log(res.datasetDetails);
      dispatch(
        updateDataset({
          id: res.datasetDetails.datasetId,
          name: res.datasetDetails.name,
          description: res.datasetDetails.description,
          createdAt: format(new Date(res.datasetDetails.createdAt), "MM-dd-yy"),
          createdBy: res.datasetDetails.createdBy,
          data: updatedFileArray,
        })
      );

      setIsDatasetFilesLoading(false);
    };

    fetchData();
  }, [currentWorkspaceName]);

  const handleDataDeletion = async (dataId: string, datasetName: string) => {
    try {
      // Placeholder for actual deletion logic
      // await deleteDataset(workspaceName,datasetId);
      // dispatch(removeDataset(datasetId));
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

  const addDataSheet = (
    <CustomSheet title="Add Data" description="Add data to your dataset here.">
      <AddDataToDatasetForm
        workspaceName={currentWorkspaceName || ""}
        datasetId={params.id}
      />
    </CustomSheet>
  );

  console.log(dataset);

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
        </div>
        <Separator className="mt-8" />
      </section>
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
                        handleDataDeletion(dataset.id, dataset.name);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent>
                    <Button className="w-full">
                      <div className="flex flex-row justify-center items-center gap-2">
                        <File className="w-4 h-4" />
                        <p>Open File</p>
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
                        <TableHead className="font-semibold">File</TableHead>
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
      </section>
    </main>
  );
};

export default DatasetByIdPage;
