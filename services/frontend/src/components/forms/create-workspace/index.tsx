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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import CustomToast from "@/components/global/custom-toast";
import { useModal } from "@/providers/modal-provider";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { v4 as uuid } from "uuid";
import { addWorkspace } from "@/providers/redux/slice/workspaceSlice";

const CreateWorkspaceForm = () => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const dispatch = useAppDispatch();

  const FormSchema = z.object({
    name: z
      .string()
      .min(5, { message: "Name must contain at least 5 characters long" }),
    description: z.string().min(5, {
      message: "Description must contain at least 5 characters long",
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

  const apiClient = axios.create({
    baseURL: process.env.baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer token`,
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const { data } = await apiClient.post("/workspaces", values);
      console.log(data);
      dispatch(
        addWorkspace({
          id: uuid(),
          name: values.name,
          description: values.description,
        })
      );

      setClose();
      toast(
        CustomToast({
          title: "Workspace Created",
          description: "Workspace has been created successfully",
        })
      );
    } catch (error) {
      toast(
        CustomToast({
          title: "Error",
          description: "An error occurred while creating the workspace",
        })
      );
    }
  };
  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  return (
    <main>
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
                "Create Workspace"
              )}
            </Button>
            <Button variant={"outline"} onClick={() => setClose()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default CreateWorkspaceForm;
