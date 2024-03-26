"use client";

import AddDataToDatasetForm from "@/components/forms/add-data-to-dataset-form";
import CustomSheet from "@/components/global/custom-sheet";
import JsonIcon from "@/components/icons/json-icon";
import PdfIcon from "@/components/icons/pdf-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { fetchDataset } from "@/lib/api/dataset/service";
import { DataBucketType } from "@/lib/constants";

import { useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { getDatasetById, updateDataset } from "@/providers/redux/slice/datasetSlice";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
  params: {
    id: string;
  };
};

const DatasetByIdPage = ({ params }: Props) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState([] as any);
  // const dataset = useAppSelector((state) => getDatasetById(state, params.id));
  const datasets = useAppSelector((state) => state.datasets.datasets);
  const dataset = datasets.filter((set: any) => set.id == params.id);
  const { setOpen } = useModal();

  const workspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );

  useEffect(() => {

    const fetchData = async () => {
      const res = await fetchDataset("IntegrationWorkspace", params.id);

      dispatch(
        updateDataset({
          id: res.datasetDetails.datasetId,
          name: res.datasetDetails.name,
          description: res.datasetDetails.description,
          createdAt: res.datasetDetails.createdAt,
          createdBy: res.datasetDetails.createdBy,
          data: res.data.map((item : any) => ({
            id: item.dataId,
            name: item.name,
            path: item.path,
            createdAt: item.createdAt,
            createdBy: item.createdBy,
          }))
        })
      );

      setFile(
        res.data.map((item: any) =>
        ({
          id: item.dataId,
          name: item.name,
          path: item.path,
          createdAt: item.createdAt,
          createdBy: item.createdBy,
        })
        )
      )

    }

    fetchData();
    console.log("datasets-------",datasets);

  }, []);



  const addDataSheet = (
    <CustomSheet title="Add Data" description="Add data to your dataset here.">
      <AddDataToDatasetForm workspaceName={workspaceName} datasetId={params.id} />
    </CustomSheet>
  );

  return (
    <main className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <h1 className="text-secondary text-3xl font-bold">
              {datasets && datasets.name}
            </h1>
            <p className="text-md text-muted-foreground hidden md:block">
              {datasets && datasets.description}
            </p>
          </div>
          <Button
            size={"lg"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {file?.map((qa: DataBucketType) => (
              <Card key={qa.id}>
                <CardContent>
                  {/* <qa.icon className="w-16" /> */}
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">{qa.name}</h3>
                    <Users className="w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">{qa.createdAt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="grid gap-8">
          <h1 className="text-2xl font-semibold">Recently Added</h1>
          <div>
            <Card className="pt-4">
              <CardContent>
                <Table>
                  <TableCaption>
                    Recently added files in {dataset && dataset.name}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">File</TableHead>
                      <TableHead className="font-semibold">Added by</TableHead>
                      <TableHead className="font-semibold">
                        Date added
                      </TableHead>
                      <TableHead className="font-semibold"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataset?.map((file: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {file.name}
                        </TableCell>
                        <TableCell>{file.addedBy}</TableCell>
                        <TableCell>{file.dateAdded}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DatasetByIdPage;
