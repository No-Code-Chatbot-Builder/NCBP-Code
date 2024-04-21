"use client";
import CreateNewAPIKey from "@/components/forms/create-api-key-form";
import CustomSheet from "@/components/global/custom-sheet";
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
import { useModal } from "@/providers/modal-provider";
import { Copy, Key, Plus } from "lucide-react";

export default function Page() {
  const apiKeys = [
    {
      name: "ncbp",
      secretKey: "sk-...Nudb",
      created: "19 Feb 2024",
      lastUsed: "Today",
    },
    {
      name: "key2",
      secretKey: "sk-...abcd",
      created: "18 Feb 2024",
      lastUsed: "Never",
    },
    {
      name: "key3",
      secretKey: "sk-...efgh",
      created: "17 Feb 2024",
      lastUsed: "Yesterday",
    },
  ];

  const { setOpen } = useModal();
  const sheetContent = (
    <CustomSheet
      title="Create New API Key"
      description="Here you can create a new api key"
    >
      <CreateNewAPIKey />
    </CustomSheet>
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <section className="mt-20 flex flex-col">
          <div className="flex items-center justify-center">
            <div className="w-5/6 mr-10 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Key className="w-5 h-5" />
                <h1 className="text-3xl font-bold">API Keys</h1>
              </div>
              <p className="text-md text-muted-foreground hidden sm:block">
                Your secret API keys are listed below. Please note that we do
                not display your secret API keys again after you generate them.{" "}
                <br />
                <br />
                Do not share your API key with others, or expose it in the
                browser or other client-side code. In order to protect the
                security of your account, NoCodeBot.ai may also automatically
                disable any API key that we have found has leaked publicly.{" "}
                <br />
                <br />
                Enable tracking to see usage per API key on the{" "}
                <span className="text-secondary underline">Usage page.</span>
              </p>
            </div>
            <Button
              size={"lg"}
              className="gap-2"
              onClick={() => {
                setOpen(sheetContent);
              }}
            >
              <Plus className="w-5 h-5" />
              <p className="flex">
                Create <span className="hidden lg:block">&nbsp;API Key</span>
              </p>
            </Button>
          </div>
        </section>
        <Separator className="mt-8" />
      </div>
      <section>
        <Card className="pt-5 ">
          <CardContent>
            <Table>
              <TableCaption>Your API Keys</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] font-semibold">
                    NAME
                  </TableHead>
                  <TableHead className="font-semibold">SECRET KEY</TableHead>
                  <TableHead className="font-semibold">CREATED AT</TableHead>
                  <TableHead className="text-right font-semibold"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>{key.secretKey}</TableCell>
                    <TableCell>{key.created}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        className="gap-3 text-muted-foreground"
                        variant={"outline"}
                        onClick={() => copyToClipboard(key.secretKey)}
                      >
                        <Copy className="w-4 h-4" />
                        <p className="hidden sm:block">Copy</p>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
