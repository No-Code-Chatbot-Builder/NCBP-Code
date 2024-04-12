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
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import { addAssistant } from "@/providers/redux/slice/assistantSlice";
import { createAssistantWithThread } from "@/lib/api/bot/service";
import { DatasetType } from "@/lib/constants";

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
    tool: z.string().min(1, { message: "Select the tool", }),
    model: z.string().min(1, { message: "Select the model" }),
    dataset: z.string().min(1, { message: "Select the dataset" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const workspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );

  const datasets = useAppSelector(
    (state) => state.datasets.datasets
  );

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const res = await createAssistantWithThread(workspaceName, values.name, values.description, values.model, values.tool);
      console.log(res.response);
      console.log(res.response[3]);

      dispatch(
        addAssistant({
          id: res.response[2].assistantId,
          name: values.name,
          description: values.description,
          owner: "currentuser",
          threadId: res.response[3].threadId,
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
                        <SelectItem value={dataset.id}>{dataset.name}</SelectItem>
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
                  <Select {...field}
                    onValueChange={(value: string) => field.onChange(value)}
                    value={field.value}>
                    <SelectTrigger >
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT 3.5</SelectItem>
                      <SelectItem value="gpt-4">Gpt 4</SelectItem>
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
                  <Select {...field}
                    onValueChange={(value: string) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger >
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retrieval">Retrieval</SelectItem>
                      <SelectItem value="code_interpreter">Code Interpreter</SelectItem>
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
            <Button variant={"outline"} onClick={() => setClose()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </main >
  );
};

export default CreateAssistantForm;
