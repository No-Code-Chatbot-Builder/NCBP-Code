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

const CreateAPIKeyForm = () => {
  const { toast } = useToast();

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
    } catch (error) {}
  };
  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

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
                    type="password"
                    placeholder="Enter the workspace description"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create API Key"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default CreateAPIKeyForm;
