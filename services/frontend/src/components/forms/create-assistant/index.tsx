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
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import { uuid } from "uuidv4";
import { addAssistant } from "@/providers/redux/slice/assistantSlice";
import { createAssistantWithThread } from "@/lib/api/bot/service";

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
      await createAssistantWithThread(values.name,values.description);
      //updating state, showing toast, closing model
      dispatch(
        addAssistant({
          id: uuid(),
          name: values.name,
          description: values.description,
          owner: "currentuser",
        })
      );
      setClose();
      toast(
        CustomToast({
          title: "Assistant Added",
          description: "Your Dataset has been created.",
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
          <div className="flex flex-row-reverse gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Assistant"
              )}
            </Button>
            <Button variant={"outline"} onClick={() => setClose()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Cancel"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default CreateAssistantForm;
