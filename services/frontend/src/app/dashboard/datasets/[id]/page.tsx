"use client";

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
import { DatasetType, dummyDataset } from "@/lib/constants";
import { Copy, PanelsTopLeft, Plus, Share, Users, Users2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

const DatasetByIdPage = ({ params }: Props) => {
  const [dataset, setDataset] = useState<DatasetType | null>(null);

  type QuickType = {
    id: string;
    title: string;
    opened: string;
    icon: React.ElementType;
  };

  const dummyQuickAccess: QuickType[] = [
    {
      id: "1",
      title: "ML.pdf",
      opened: "Opened 3 days ago",
      icon: PdfIcon,
    },
    {
      id: "2",
      title: "DL.pdf",
      opened: "Opened 4 days ago",
      icon: PdfIcon,
    },
    {
      id: "3",
      title: "Package.json",
      opened: "Opened 5 days ago",
      icon: JsonIcon,
    },
  ];

  const dummyFiles = [
    {
      name: "ml.pdf",
      addedBy: "@ibrahimsheikh",
      dateAdded: "2 Months Ago",
    },
    {
      name: "dl.pdf",
      addedBy: "@hussainmurtaza",
      dateAdded: "6 Days Ago",
    },
    {
      name: "package.json",
      addedBy: "@shariqanwar",
      dateAdded: "A Month Ago",
    },
  ];

  useEffect(() => {
    const fetchedDataset = dummyDataset.find((d) => d.id === params.id);
    if (fetchedDataset) {
      setDataset(fetchedDataset);
    }
  }, [params.id]);

  if (!dataset) {
    return <div>Dataset not found</div>;
  }

  return (
    <main className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <h1 className="text-secondary text-3xl font-bold">
              {dataset.name}
            </h1>
            <p className="text-md text-muted-foreground hidden md:block">
              {dataset.description}
            </p>
          </div>
          <Button
            size={"lg"}
            className="gap-2"
            variant={"outline"}
            onClick={() => {}}
          >
            <Plus className="w-5 h-5" />
            Add Data
          </Button>
        </div>
        <Separator className="mt-8" />
      </section>
      <section>
        <div className="grid gap-8">
          <h1 className="text-2xl font-bold">Quick Access</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dummyQuickAccess.map((qa) => (
              <Card key={qa.id}>
                <CardContent>
                  <qa.icon className="w-16" />
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">{qa.title}</h3>
                    <Users className="w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">{qa.opened}</p>
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
                    Recently added files in {dataset.name}
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
                    {dummyFiles.map((file, index) => (
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
