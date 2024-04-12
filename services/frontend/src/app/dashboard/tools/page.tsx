"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";


export default function Page() {

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <h1 className="text-secondary text-3xl font-bold">Tools</h1>
            <p className="text-md text-muted-foreground hidden sm:block">

            </p>
          </div>
        </div>
        <Separator className="mt-8" />
      </section>
    </div>
  );
}
