"use client";
import CustomModel from "@/components/global/custom-model";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useModal } from "@/providers/modal-provider";
import { Edit2, Plus } from "lucide-react";

type DatasetType = {
  name: string;
  description: string;
};

const dummyDataset: DatasetType[] = [
  {
    name: "Ibrahim's Dataset",
    description: "Contains Ibrahim's Essential Data",
  },
  {
    name: "Hussain's Dataset",
    description: "Contains Hussain's Essential Data",
  },
];

export default function Page() {
  const { setOpen } = useModal();
  const datasetModal = (
    <CustomModel
      title="Create New Dataset"
      subheading="Add data to your dataset here."
    >
      <div></div>
    </CustomModel>
  );
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6">
            <h1 className="text-secondary text-3xl font-bold">Datasets</h1>
            <p className="text-md text-muted-foreground">
              Datasets help you manage your data which you can use to configure
              your workspace. Create your personal dataset and start using it
              now.
            </p>
          </div>
          {/*Desktop Create Button*/}

          <Button
            size={"lg"}
            className="gap-2 hidden lg:flex"
            variant={"outline"}
            onClick={() => {
              setOpen(datasetModal);
            }}
          >
            <Plus className="w-5 h-5" />
            Create New Dataset
          </Button>

          {/*Mobile Create Button*/}
          <Button
            size={"icon"}
            variant={"outline"}
            className="lg:hidden"
            onClick={() => {
              setOpen(datasetModal);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Separator className="mt-8" />
      </section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
          {dummyDataset.map((dataset) => (
            <Card key={dataset.name}>
              <CardHeader>
                <CardTitle>{dataset.name}</CardTitle>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full gap-2">
                  <Edit2 className="w-5 h-5" />
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
