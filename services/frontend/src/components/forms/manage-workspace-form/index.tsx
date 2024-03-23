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

const ManageWorkspaceCard = () => {
  const { toast } = useToast();

  const FormSchema = z.object({
    workspaceId: z.string().min(2, {
      message: "This is your workspaceId",
    }),
    workspaceName: z.string().min(2, {
      message: "Workspace Name must be at least 2 characters.",
    }),
    workspaceDescription: z.string().min(2, {
      message: "Workspace Description must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      workspaceId: "",
      workspaceName: "",
      workspaceDescription: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values);
    await editWorkspace(values.workspaceId, values?.workspaceName, values?.workspaceDescription);
    
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
                name="workspaceId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="">Workspace ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="83927392dfeudnski8"
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
                name="workspaceName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="">Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ibrahim's Workspace"
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
                name="workspaceDescription"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="">Workspace Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="For University"
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
