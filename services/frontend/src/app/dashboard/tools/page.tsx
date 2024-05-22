"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PocketKnife } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <div className="flex gap-2 items-center">
              <PocketKnife className="w-5 h-5" />
              <h1 className="text-3xl font-bold">Tools</h1>
            </div>
            <p className="text-md text-muted-foreground hidden sm:block"></p>
          </div>
        </div>
        <Separator className="mt-8" />
      </section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                  <CardTitle>Integrate Your Assistant</CardTitle>
                  <CardDescription>
                    Integrate your assistant to your website
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3">
              {/* <p className="text-muted-foreground">@{assistant.id}</p> */}
              <Button
                variant={"default"}
                className="w-full"
                onClick={() => {
                  // router.replace(`/assistant/${assistant.id}`);
                }}
              >
                Integrate Assistant
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                  <CardTitle>Generate Jsonl Data</CardTitle>
                  <CardDescription>
                    Convert any data in Jsonl format
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3">
              {/* <p className="text-muted-foreground">@{assistant.id}</p> */}
              <Button
                variant={"default"}
                className="w-full"
                onClick={() => {
                  // router.replace(`/assistant/${assistant.id}`);
                }}
              >
                Generate Jsonl Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
