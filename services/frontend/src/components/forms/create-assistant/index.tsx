"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import { addAssistant } from "@/providers/redux/slice/assistantSlice";
import { createAssistantWithThread } from "@/lib/api/bot/service";
import { DatasetType } from "@/lib/constants";
import { Loader2, Trash } from "lucide-react";

const CreateAssistantForm = () => {
  const dispatch = useAppDispatch();
  const { setClose } = useModal();

  const FormSchema = z.object({
    name: z
      .string()
      .min(5, { message: "Name must contain atleast 5 characters long" }),
    description: z.string().min(5, {
      message: "Description must contain atleast 5 characters long",
    }),
    dataset: z.string().min(1, { message: "Select the dataset" }),
    tool: z.string().min(1, { message: "Select the tool" }),
    model: z.string().min(1, { message: "Select the model" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );


  const datasets = useAppSelector((state) => state.datasets.datasets);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      console.log(values);
      const res = await createAssistantWithThread(
        currentWorkspaceName!,
        values.name,
        values.description,
        values.model,
        values.tool,
        values.dataset,
        // values.site,
      );
      console.log(res.response);
      console.log(res.response[2].split(": ")[1].trim());

      dispatch(
        addAssistant({
          id: res.response[2].split(": ")[1].trim(),
          name: values.name,
          description: values.description,
          allowedDomain : [],
          // owner: "currentuser",
          // threadId: res.response[3].threadId,
        })
      );
      setClose();
      toast(
        CustomToast({
          title: "Assistant Added",
          description: "Your Assistant has been created.",
        })
      );
    } catch (error: any) {
      //throwing error if any
      console.log(error);
      toast(
        CustomToast({
          title: "Error Creating Assistant",
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
                  <Input placeholder="Enter the assistant name" {...field} />
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
                    placeholder="Enter the assistant description"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="dataset"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Dataset</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value: string) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select knowledge base of your assistant" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.map((dataset: DatasetType) => (
                        <SelectItem key={dataset.id} value={dataset.id}>
                          {dataset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Model</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value: string) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4">Gpt 4</SelectItem>
                      <SelectItem value="gpt-4-turbo">Gpt 4 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">Gpt 4o (Latest)</SelectItem>

                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="tool"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Tool</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value: string) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file_search">Retrieval</SelectItem>
                      <SelectItem value="code_interpreter">
                        Code Interpreter
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                "Create Assistant"
              )}
            </Button>
            <Button
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                setClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </main >
  );
};

export default CreateAssistantForm;
