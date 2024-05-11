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
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { editWorkspace } from "@/lib/api/workspace/service";
import { useAppSelector } from "@/lib/hooks";

const ManageWorkspaceCard = () => {
  const { toast } = useToast();

  const selectedWorkspace = useAppSelector(
    (state) => state.workspaces.selectedWorkspace
  );

  const FormSchema = z.object({
    workspaceName: z.string().min(2, {
      message: "Workspace Name must be at least 2 characters.",
    }),
    role: z.string().min(2, {
      message: "Role must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      workspaceName: selectedWorkspace?.name ?? "",
      role: selectedWorkspace?.role ?? "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values);
  };
  const isLoading = form.formState.isSubmitting;
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Workspace</CardTitle>
          <CardDescription>
            Edit Changes to your existing workspace
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
                name="workspaceName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="">Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your workspace name"
                        {...field}
                        className="bg-card dark:border-primary/50"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-xs px-1" />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="">Workspace Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your role"
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
                type="submit"
                disabled={isLoading}
                size={"lg"}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageWorkspaceCard;
