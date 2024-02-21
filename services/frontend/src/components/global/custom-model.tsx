"use client";

import { useModal } from "@/providers/modal-provider";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CustomModel = ({ title, subheading, children, defaultOpen }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen}>
      <DialogContent className="bg-card">
        <DialogHeader className="pt-3">
          <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button onClick={setClose}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModel;
