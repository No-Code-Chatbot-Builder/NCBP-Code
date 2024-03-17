"use client";
import CreateDatasetForm from "@/components/forms/create-dataset";

import CustomSheet from "@/components/global/custom-sheet";
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
import { DatasetType } from "@/lib/constants";
import { useAppSelector } from "@/lib/hooks";

import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { setOpen } = useModal();
  const datasets = useAppSelector((state) => state.datasets.datasets);

  const router = useRouter();
  const datasetSheet = (
    <CustomSheet
      title="Create New Dataset"
      description="Add data to your dataset here."
    >
      <CreateDatasetForm />
    </CustomSheet>
  );
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <h1 className="text-secondary text-3xl font-bold">Datasets</h1>
            <p className="text-md text-muted-foreground hidden md:block">
              Datasets help you manage your data which you can use to configure
              your workspace. Create your personal dataset and start using it
              now.
            </p>
          </div>
          {/*Desktop Create Button*/}

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
        </div>
        <Separator className="mt-8" />
      </section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
          {datasets.map((dataset: DatasetType) => (
            <Card key={dataset.name}>
              <CardHeader>
                <CardTitle>{dataset.name}</CardTitle>
                <CardDescription>{dataset.description}</CardDescription>
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
      </section>
    </div>
  );
}
