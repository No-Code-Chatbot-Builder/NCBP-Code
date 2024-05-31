"use client";
import React, { useEffect, useState } from "react";
import CreateAssistantForm from "@/components/forms/create-assistant";
import CustomSheet from "@/components/global/custom-sheet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AssistantType } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { Code, CopyIcon, Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import {
  removeAssistant,
  setAssistant,
  setIsAssistantLoading,
} from "@/providers/redux/slice/assistantSlice";
import { deleteAssistants } from "@/lib/api/bot/service";
import CreateDomainForm from "@/components/forms/create-domain-form";
import CustomToast from "@/components/global/custom-toast";
import { toast } from "sonner";
import CustomModel from "@/components/global/custom-model";
import { useAxiosSWR } from "@/lib/api/useAxiosSWR";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function Page() {
  const isAssistantLoading = useAppSelector(
    (state) => state.assistants.isAssistantLoading
  );
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );
  const [isAssistantDeleting, setIsAssistantDeleting] = useState(false);
  const { setOpen, setClose } = useModal();
  const assistants = useAppSelector((state) => state.assistants.assistants);

  const copy = (id: string) => {
    setCopied({ ...copied, [id]: true });
    setTimeout(() => {
      setCopied({ ...copied, [id]: false });
    }, 5000);
  };
  const notify = (id: string) => {
    copy(id);
    toast(
      CustomToast({
        title: "Copied to clipboard!",
        description:
          "Use this iframe component to integrate the assistant in your website.",
      })
    );
  };

  const manageDomains = (assistantId: string) => {
    setOpen(
      <CustomSheet
        title="Add Domains for your assistants"
        description="Here you can add domains on which your bot will be embedded."
      >
        <CreateDomainForm assistantId={assistantId} />
      </CustomSheet>
    );
  };

  const assistantSheet = (
    <CustomSheet
      title="Create New Assistant"
      description="Configure the assistant by filling in the details"
    >
      <CreateAssistantForm />
    </CustomSheet>
  );

  const deleteAssistantModel = (
    assistant_id: string,
    assistant_name: string
  ) => (
    <CustomModel
      title={`Delete ${assistant_name}`}
      description={`Are you sure you want to delete ${assistant_name}?`}
    >
      <div className="flex justify-end gap-2">
        <Button
          variant={"outline"}
          onClick={() => {
            setClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant={"destructive"}
          onClick={() => {
            setClose();
            handleAssistantDeletion(assistant_id, assistant_name);
          }}
        >
          Delete
        </Button>
      </div>
    </CustomModel>
  );

  const handleCreateAssistant = async () => {
    setOpen(assistantSheet);
  };

  const handleAssistantDeletion = async (
    assistant_id: string,
    assistant_name: string
  ) => {
    setIsAssistantDeleting(true);
    try {
      const res = await deleteAssistants(currentWorkspaceName!, assistant_id);
      if (res.statusCode == 201) {
        dispatch(removeAssistant(assistant_id));
        toast(
          CustomToast({
            title: `${assistant_name} Deleted`,
            description: `${assistant_name} has been deleted successfully.`,
          })
        );
      }
    } catch (error) {
      toast(
        CustomToast({
          title: "Error During Deletion",
          description:
            "An error occurred while deleting the assistant. Please try again.",
        })
      );
      console.error(error);
    } finally {
      setIsAssistantDeleting(false);
    }
  };

  if (isAssistantDeleting) {
    return (
      <div className="h-screen flex w-full items-center justify-center">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lg font-semibold animate-pulse">
            Deleting Assistant...
          </p>
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6 mr-10">
            <div className="flex gap-2 items-center">
              <Code className="w-5 h-5" />
              <h1 className="text-3xl font-bold">Assistants</h1>
            </div>
            <p className="text-md text-muted-foreground hidden sm:block">
              Assistants help you through your daily workflow tasks. Create
              custom assistants according to your personal needs and
              requirements.
            </p>
          </div>
          <Button size={"lg"} className="gap-2" onClick={handleCreateAssistant}>
            <Plus className="w-5 h-5" />
            <p className="flex">
              Create <span className="hidden lg:block">&nbsp;Assistant</span>
            </p>
          </Button>
        </div>
        <Separator className="mt-8" />
      </section>
      {isAssistantLoading ? (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
            {Array.from(Array(3).keys()).map((key) => (
              <LoadingSkeleton key={key} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          {assistants.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {assistants.map((assistant: AssistantType) => (
                <Card key={assistant.id}>
                  <CardHeader>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col gap-2">
                        <CardTitle>{assistant.name}</CardTitle>
                        <CardDescription>
                          {assistant.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant={"ghost"}
                          onClick={() => {
                            setOpen(
                              deleteAssistantModel(assistant.id, assistant.name)
                            );
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-3 ">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="w-full"
                        variant={"outline"}
                        onClick={() => {
                          manageDomains(assistant.id);
                        }}
                      >
                        Manage Domains
                      </Button>
                      <Button
                        className="w-full"
                        variant={"outline"}
                        onClick={() => {}}
                      >
                        <CopyToClipboard
                          text={`<iframe
                          src="http://localhost:3000/chatbot?workspaceId=${currentWorkspaceName}&assistantId=${assistant.id}"
                          title="${assistant.name}"
                        />`}
                          onCopy={() => notify(assistant.id)}
                        >
                          {copied[assistant.id] ? (
                            <p>Copied To Clipboard</p>
                          ) : (
                            <p> Integrate Assistant</p>
                          )}
                        </CopyToClipboard>
                      </Button>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        router.replace(`/assistant/${assistant.id}`);
                      }}
                    >
                      Use Assistant
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="w-full h-[65vh] flex items-center justify-center ">
              <div className="bg-card border dark:border-primary border-border p-16 rounded-lg flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-center">
                  No Assistants Available
                </h2>
                <p className="text-muted-foreground text-center mt-2">
                  Create an assistant to get started.
                </p>
                <Button
                  className="flex items-center justify-center gap-2 bg-primary p-3 rounded-lg mt-5"
                  onClick={handleCreateAssistant}
                >
                  <Code className="w-4 h-4" />
                  <p className="text-md font-semibold">Create Assistant</p>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
