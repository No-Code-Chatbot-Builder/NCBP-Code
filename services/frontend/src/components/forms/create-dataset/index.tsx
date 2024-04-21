"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addDataset } from "@/providers/redux/slice/datasetSlice";
import CustomToast from "@/components/global/custom-toast";
import { toast } from "sonner";
import { createDataset } from "@/lib/api/dataset/service";
import { useCustomAuth } from "@/providers/auth-provider";

const CreateDatasetForm = () => {
  const dispatch = useAppDispatch();
  const { setClose } = useModal();
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );

  const user = useCustomAuth().user;

  const FormSchema = z.object({
    name: z
      .string()
      .min(5, { message: "Name must contain atleast 5 characters long" }),
    description: z.string().min(5, {
      message: "Description must contain atleast 5 characters long",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const res = await createDataset(
        currentWorkspaceName!,
        values.name,
        values.description
      );

      //updating state, showing toast, closing model
      dispatch(
        addDataset({
          id: res.datasetDetails.datasetId,
          name: res.datasetDetails.name,
          description: res.datasetDetails.description,
          createdAt: new Date().toISOString(),
          createdBy: user?.sub,
          data: [],
        })
      );

      setClose();
      toast(
        CustomToast({
          title: "Dataset Added",
          description: "Your Dataset has been created.",
        })
      );
    } catch (error: any) {
      //throwing error if any
      toast(
        CustomToast({
          title: "Error Creating Dataset",
          description: error.toString(),
        })
      );
    }
  };
  const isLoading = form.formState.isSubmitting;

  return (
    <main className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the workspace name" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the workspace description"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Dataset"
              )}
            </Button>
            <Button variant="outline" onClick={() => setClose()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default CreateDatasetForm;
