"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteWorkspace } from "@/lib/api/workspace/service";
import { useAppSelector } from "@/lib/hooks";
import CustomToast from "@/components/global/custom-toast";
import { deleteAllDatasets } from "@/lib/api/dataset/service";

const DeleteAllDatasetsCard = () => {
  const { toast } = useToast();
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );

  const FormSchema = z.object({
    confirmation: z.string().refine((val) => val.toLowerCase() === "delete", {
      message: "You must enter 'delete' to confirm deletion",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await deleteAllDatasets(currentWorkspaceName ?? "");
    } catch (err: any) {
      toast(
        CustomToast({
          title: "Error",
          description: "An error occurred while deleting the dataset",
        })
      );
    }
  };
  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="w-full my-10">
      <CardHeader>
        <CardTitle>Delete Datasets</CardTitle>
        <CardDescription>
          Deleting all datasets will permanently remove all data associated with
          it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 lg:px-32"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="">Confirmation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 'DELETE' to confirm deletion"
                      {...field}
                      className="bg-card dark:border-primary/50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-xs px-1" />
                </FormItem>
              )}
            />

            <Button
              className="px-10"
              variant={"destructive"}
              type="submit"
              disabled={isLoading}
              size={"lg"}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete All Datasets"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeleteAllDatasetsCard;
