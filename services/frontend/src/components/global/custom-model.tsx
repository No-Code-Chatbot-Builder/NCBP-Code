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
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CustomModel = ({ title, description, children, defaultOpen }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen}>
      <DialogContent className="bg-card">
        <DialogHeader className="pt-3">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModel;
