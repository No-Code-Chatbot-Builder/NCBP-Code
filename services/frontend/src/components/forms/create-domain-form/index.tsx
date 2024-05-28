"use client";

import React, { FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  addDomainToAssistant,
  removeDomainFromAssistant,
  setDomainsToAssistant,
} from "@/providers/redux/slice/assistantSlice";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import {
  addDomain,
  deleteDomain,
  getDomainsByAssistant,
} from "@/lib/api/key/service";
import CustomToast from "@/components/global/custom-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";

interface CreateDomainFormProps {
  assistantId: string;
}

const CreateDomainForm = ({ assistantId }: CreateDomainFormProps) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const dispatch = useAppDispatch();
  const assistant = useAppSelector((state) =>
    state.assistants.assistants.find((a) => a.id === assistantId)
  );
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );
  const FormSchema = z.object({
    assistant: z.string().min(1, { message: "Select the assistant" }),
    site: z.string().min(10, { message: "Enter a valid URL" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      assistant: "",
      site: "",
    },
  });

  useEffect(() => {
    const fetchDomains = async () => {
      if (!currentWorkspaceName) return;
      try {
        const res = await getDomainsByAssistant(
          currentWorkspaceName!,
          assistantId
        );
        
        dispatch(
          setDomainsToAssistant({
            domain: res.resultDomain.allowedDomains,
            assistantId: assistant!.id,
          })
        );
      } catch (error: any) {
        console.error("Failed to fetch assistants:", error);
      }
    };
    fetchDomains();
  }, [currentWorkspaceName]);

  const handleAddSite = async (e: FormEvent) => {
    e.preventDefault();
    const newSite = form.getValues("site");
    if (newSite && !assistant!.allowedDomain?.includes(newSite)) {
      form.setValue("site", "");
      try {
        const response = await addDomain(
          currentWorkspaceName!,
          assistant!.id,
          newSite
        );
        dispatch(
          addDomainToAssistant({
            domain: response.resultDomain.allowedDomains[0],
            assistantId: assistant!.id,
          })
        );
        toast(
          CustomToast({
            title: "API Key Created",
            description: "API Key has been created successfully.",
          })
        );
      } catch (error: any) {
        toast(
          CustomToast({
            title: "Error During API Key Creation",
            description:
              "An error occurred while creating the API Key. Please try again.",
          })
        );
      }
    }
  };

  const handleDeleteSite = async (e: FormEvent, site: string) => {
    e.preventDefault();
    try {
      await deleteDomain(currentWorkspaceName!, assistant!.id, site);
      dispatch(
        removeDomainFromAssistant({
          domain: site,
          assistantId: assistant!.id,
        })
      );
      toast(
        CustomToast({
          title: "API Key Created",
          description: "API Key has been created successfully.",
        })
      );
    } catch (error: any) {
      toast(
        CustomToast({
          title: "Error During API Key Creation",
          description:
            "An error occurred while creating the API Key. Please try again.",
        })
      );
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <main className="mt-4">
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="assistant"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Assistant</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the assistant name"
                    {...field}
                    value={assistant!.name}
                    readOnly
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="site"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Site URL</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input placeholder="Enter the site url" {...field} />
                    <Button
                      onClick={(e) => handleAddSite(e)}
                      disabled={!field.value!.trim()}
                    >
                      Add Site
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          {assistant!.allowedDomain?.length > 0 ? (
            <ul className="list-disc mt-2 bg-sidebar p-2 max-h-96 overflow-y-auto  mb-8">
              {assistant!.allowedDomain?.map((site, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-sm text-white mb-1 bg-background p-3"
                >
                  {site}
                  <button
                    onClick={(e) => handleDeleteSite(e, site)}
                    title="Delete site"
                  >
                    <Trash className="h-5 w-5 hover:text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="list-disc mt-2 bg-sidebar p-2 text-center">
              No site added.
            </div>
          )}
          <div className="flex flex-row-reverse">
            <Button onClick={() => setClose()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default CreateDomainForm;
