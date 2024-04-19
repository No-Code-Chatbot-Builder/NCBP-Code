"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PocketKnife } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <div className="flex gap-2 items-center">
              <PocketKnife className="w-7 h-7" />
              <h1 className="text-3xl font-bold">Tools</h1>
            </div>
            <p className="text-md text-muted-foreground hidden sm:block"></p>
          </div>
        </div>
        <Separator className="mt-8" />
      </section>
    </div>
  );
}
