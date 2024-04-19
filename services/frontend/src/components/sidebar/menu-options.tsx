"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  ChevronsUpDown,
  Menu,
  Plus,
  PlusCircleIcon,
  Settings,
  User,
} from "lucide-react";
import clsx from "clsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Link from "next/link";
import { useModal } from "@/providers/modal-provider";
import Image from "next/image";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

import PersonalDetails from "./personal-details";
import { AssistantType, dummyChatThreads, icons } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ModeDashboardToggle } from "../global/mode-dashboard";
import CustomModel from "../global/custom-model";
import CreateWorkspaceForm from "../forms/create-workspace";

import { useCustomAuth } from "@/providers/auth-provider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  WorkspaceType,
  setWorkspaces,
  setCurrentWorkspace as setReduxCurrentWorkspace,
  setIsWorkspaceLoading,
} from "@/providers/redux/slice/workspaceSlice";
import { fetchWorkspaces } from "@/lib/api/workspace/service";
import { fetchDatasets } from "@/lib/api/dataset/service";
import {
  setDatasets,
  setIsDatasetLoading,
} from "@/providers/redux/slice/datasetSlice";
import {
  setAssistant,
  setIsAssistantLoading,
} from "@/providers/redux/slice/assistantSlice";
import { retrieveAssistants } from "@/lib/api/bot/service";

type Props = {
  defaultOpen?: boolean;
  sidebarOpt: SidebarOption[];
  id: string;
  type: string;
};

const WorkspaceMenuOptions = ({
  sidebarOpt,
}: {
  sidebarOpt: SidebarOption[];
}) => {
  const dispatch = useAppDispatch();
  const { logout } = useCustomAuth();
  const { setOpen } = useModal();
  const pathname = usePathname();
  const workspaces = useAppSelector(
    (state: { workspaces: { workspaces: any } }) => state.workspaces.workspaces
  );
  const assistants = useAppSelector(
    (state: { assistants: { assistants: any } }) => state.assistants.assistants
  );

  const [currentWorkspace, setCurrentWorkspaceState] = useState(() => {
    const initialWorkspace = workspaces.length > 0 ? workspaces[0].name : "";
    return initialWorkspace;
  });

  useEffect(() => {
    const fetchUserData = async () => {
      //initialize the loading states
      dispatch(setIsDatasetLoading(true));
      dispatch(setIsWorkspaceLoading(true));
      dispatch(setIsAssistantLoading(true));
      //load the workspaces
      const workspaces = await fetchWorkspaces();
      if (workspaces) {
        const formattedWorkspaces: WorkspaceType[] = Object.entries(
          workspaces
        ).map(([key, value]: [string, unknown]) => ({
          name: key,
          role: value as string,
        }));
        dispatch(setWorkspaces(formattedWorkspaces));
        dispatch(setIsWorkspaceLoading(false));

        //load the datasets according to workspace
        if (formattedWorkspaces.length > 0) {
          const firstWorkspaceName = formattedWorkspaces[0].name;
          setCurrentWorkspaceState(firstWorkspaceName);
          dispatch(setReduxCurrentWorkspace(firstWorkspaceName));
          const res = await fetchDatasets(firstWorkspaceName);
          dispatch(setDatasets(res?.datasets));
        }

        dispatch(setIsDatasetLoading(false));

        //load the assistants now
        const res = await retrieveAssistants(currentWorkspace);
        if (res && res.response && res.response.assistants) {
          const assistants: AssistantType[] = res.response.assistants.map(
            (assistant: any) => ({
              id: assistant.assistantId,
              name: assistant.assistantName,
              description: assistant.purpose,
            })
          );
          dispatch(setAssistant(assistants));
          dispatch(setIsAssistantLoading(false));
        }
      }
    };
    if (workspaces.length === 0 || assistants.length === 0) {
      fetchUserData();
    }
  }, [currentWorkspace]);

  const changeCurrentWorkspace = (name: string) => {
    setCurrentWorkspaceState(name);
    dispatch(setReduxCurrentWorkspace(name));
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="p-10 mb-10 bg-transparent border-none group hover:bg-sidebar-hover"
            variant={"outline"}
          >
            <div className="flex flex-row md:w-[250px] w-full gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 relative">
                  <Link href={"/"}>
                    <Image
                      src={"/assets/ncbai.svg"}
                      alt="NCBP Logo"
                      fill
                      className="rounded-md object-contain"
                    />
                  </Link>
                </div>

                <div className="flex flex-col justify-start items-start">
                  <h1 className="text-xl font-bold text-secondary-foreground">
                    NoCodeBot.ai
                  </h1>
                  <p className="text-muted-foreground text-sm font-normal">
                    {currentWorkspace}
                  </p>
                </div>
              </div>
              <ChevronsUpDown className="w-5 h-5 text-muted-foreground group-hover:text-secondary-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mt-3 ml-5 w-96 h-fit z-50">
          <Card className="border-2 border-text-muted">
            <CardHeader>
              <CardTitle className="text-xl">Toggle Workspace</CardTitle>
              <CardDescription className="text-xs">
                Select the workspace you want to work with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workspaces.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    Create a workspace to get started.
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    <div className="overflow-y-auto max-h-44 md:max-h-96">
                      {workspaces?.map((workspace: WorkspaceType) => (
                        <div
                          onClick={() => changeCurrentWorkspace(workspace.name)}
                          key={workspace.name}
                          className={`${
                            workspace.name == currentWorkspace
                              ? "bg-primary/50"
                              : "hover:bg-primary/30"
                          } hover:cursor-pointer p-2 my-2 border-2 border-text-muted rounded-md`}
                        >
                          {workspace.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    setOpen(
                      <CustomModel
                        title="Create New Workspace"
                        description="Enter the details below to create a new workspace"
                      >
                        <CreateWorkspaceForm />
                      </CustomModel>
                    );
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Create Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-4 overflow-visible">
          <CommandEmpty>No Results Found</CommandEmpty>
          {sidebarOpt.map((sidebarOption) => (
            <React.Fragment key={sidebarOption.heading}>
              <div className=" py-2" key={sidebarOption.heading}>
                <h3 className="text-sm text-primary font-medium">
                  {sidebarOption.heading}
                </h3>
                <CommandGroup className="overflow-visible">
                  {sidebarOption.items.map((option) => {
                    let val;
                    const result = icons.find(
                      (icon) => icon.value === option.icon
                    );
                    if (result) {
                      val = <result.path className="w-5 h-5" />;
                    }
                    return (
                      <CommandItem
                        key={option.name}
                        className={clsx(
                          "md:w-[250px] w-full text-muted-foreground font-normal hover:bg-sidebar-hover mb-1",
                          {
                            "bg-sidebar-hover text-sidebar-foreground":
                              pathname === option.link,
                          }
                        )}
                      >
                        <Link
                          href={option.link}
                          className="flex items-center gap-4 rounded-md transition-all md:w-[250px] w-full p-1"
                        >
                          {val}
                          <span className="font-medium">{option.name}</span>
                        </Link>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            </React.Fragment>
          ))}
        </CommandList>
      </Command>
      <section>
        <div>
          <ModeDashboardToggle />
        </div>

        <Popover>
          <PopoverTrigger className="hover:bg-card rounded-lg p-1">
            <PersonalDetails />
          </PopoverTrigger>
          <PopoverContent className="w-[260px] mb-2">
            <Command>
              <CommandList>
                <CommandGroup heading="">
                  <CommandItem>
                    <Button onClick={logout} className="w-full bg-card">
                      <div className="flex justify-start w-full items-center">
                        <User className="w-4 h-4 mr-4" />
                        <p className="text-center">Sign Out</p>
                      </div>
                    </Button>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </section>
    </>
  );
};

const ChatbotMenuOptions = () => {
  const { logout } = useCustomAuth();
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center justify-between gap-10 my-4 mx-2">
        <div className=" flex items-center">
          <div className="flex flex-row gap-2">
            <Image
              src="/assets/ncbai.svg"
              alt="NCBP Logo"
              width={30}
              height={30}
            />
            <h1 className="text-xl font-bold text-secondary-foreground">
              NoCodeBot.ai
            </h1>
          </div>
          <Button
            size={"sm"}
            variant={"outline"}
            className="ml-12 text-xs p-1 rounded-xl"
            onClick={() => {
              //create new thread and add it in the chat threads
            }}
          >
            New Chat
          </Button>
        </div>
        <Command className="rounded-lg overflow-visible bg-transparent">
          <CommandList>
            <CommandGroup>
              <h3 className="text-sm text-primary font-medium mb-4">Today</h3>
              {dummyChatThreads.map((chat) => (
                <CommandItem
                  key={chat.id}
                  className={clsx(
                    "md:w-[230px] w-full text-muted-foreground font-normal hover:bg-sidebar-hover mb-1"
                  )}
                >
                  <Link
                    href={"#"}
                    className="flex items-center gap-4 rounded-md transition-all md:w-[250px] w-full p-1"
                  >
                    <span className="font-medium">{chat.name}</span>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <div>
        <Popover>
          <PopoverTrigger className="hover:bg-card rounded-lg p-1">
            <PersonalDetails />
          </PopoverTrigger>
          <PopoverContent className="w-[260px] mb-2">
            <Command>
              <CommandList>
                <CommandGroup heading="">
                  <CommandItem>
                    <Button
                      onClick={() => {
                        router.back();
                      }}
                      className="w-full bg-card"
                    >
                      <div className="flex justify-start w-full items-center">
                        <Settings className="w-4 h-4 mr-4" />
                        <p className="text-center">Manage Workspace</p>
                      </div>
                    </Button>
                  </CommandItem>
                  <CommandItem>
                    <Button onClick={logout} className="w-full bg-card">
                      <div className="flex justify-start w-full items-center">
                        <User className="w-4 h-4 mr-4" />
                        <p className="text-center">Sign Out</p>
                      </div>
                    </Button>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

const MenuOptions = ({ id, sidebarOpt, defaultOpen, type }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:!hidden flex"
      >
        <Button variant="outline" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side={"left"}
        className={clsx(
          "backdrop-blur-xl fixed top-0 p-6 bg-sidebar shadow-none",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          <nav className="flex flex-col justify-between h-full">
            {type === "chatbot" ? (
              <ChatbotMenuOptions />
            ) : (
              <WorkspaceMenuOptions sidebarOpt={sidebarOpt} />
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
