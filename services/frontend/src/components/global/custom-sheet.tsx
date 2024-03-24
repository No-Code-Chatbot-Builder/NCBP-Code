"use client";

import { useModal } from "@/providers/modal-provider";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CustomSheet = ({ title, description, children, defaultOpen }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Sheet open={isOpen || defaultOpen}>
      <SheetClose asChild>
        <SheetContent
          side={"right"}
          className="bg-background w-[400px] sm:w-[540px]"
          showX={true}
        >
          <SheetHeader className="pt-10">
            <SheetTitle className="text-2xl font-bold">{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </SheetClose>
    </Sheet>
  );
};

export default CustomSheet;
