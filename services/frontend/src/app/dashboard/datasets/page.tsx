import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Database, Edit, Edit2, PanelLeftDashed, Plus } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-secondary text-3xl font-bold">Datasets</h1>
            <p className="text-md text-muted-foreground">
              Datasets help you manage your data which you can use to configure
              your workspace. Create your personal dataset and start using it
              now.
            </p>
          </div>
          <Button size={"lg"} className="gap-2">
            <Plus className="w-5 h-5" />
            Create New Dataset
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
