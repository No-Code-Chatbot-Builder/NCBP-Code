"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  ChevronsUpDown,
  Loader2,
  Menu,
  Plus,
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
import { icons } from "@/lib/constants";
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
  setIsWorkspaceLoading,
  setCurrentWorkspace,
  addWorkspace,
  CurrentWorkspaceType,
} from "@/providers/redux/slice/workspaceSlice";
import { toast } from "sonner";
import CustomToast from "../global/custom-toast";
import { setIsAssistantLoading } from "@/providers/redux/slice/assistantSlice";
import { setIsDatasetLoading } from "@/providers/redux/slice/datasetSlice";
import { useAxiosSWR } from "@/lib/api/useAxiosSWR";
import { cn } from "@/lib/utils";
import { createWorkspace, fetchWorkspace } from "@/lib/api/workspace/service";

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
  const isWorkspaceLoading = useAppSelector(
    (state) => state.workspaces.isWorkspaceLoading
  );

  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );
  const { data: res, error, isLoading } = useAxiosSWR("/users/");

  const fetchCurrentWorkspace = async (workspaceName: string) => {
    const res = await fetchWorkspace(workspaceName);
    dispatch(setCurrentWorkspace(res.workspace));
    localStorage.setItem("currentWorkspace", JSON.stringify(res.workspace));
  };

  const createInitialWorkspace = async () => {
    try {
      await createWorkspace("defaultworkspace", "");
      const workspace: WorkspaceType = {
        name: "defaultworkspace",
        role: "owner",
      };
      dispatch(addWorkspace(workspace));
      fetchCurrentWorkspace(workspace.name);
    } catch (error: any) {
      console.log(error);
      toast(
        CustomToast({
          title: "Error",
          description: error.toString(),
        })
      );
    }
  };

  useEffect(() => {
    dispatch(setIsWorkspaceLoading(true));
    const localCurrentWorkspace = localStorage.getItem("currentWorkspace");
    const parsedLocalCurrentWorkspace: CurrentWorkspaceType =
      localCurrentWorkspace != "undefined"
        ? JSON.parse(localCurrentWorkspace!)
        : null;

    if (error) {
      dispatch(setIsWorkspaceLoading(false));
      toast(
        CustomToast({
          title: "Error",
          description: "Failed to load workspace.",
        })
      );
      return;
    }
    if (!isLoading) {
      if (res.data.workspaces) {
        const formattedWorkspaces: WorkspaceType[] = Object.entries(
          res.data.workspaces
        ).map(([key, value]: [string, unknown]) => ({
          name: key,
          role: value as string,
        }));

        if (parsedLocalCurrentWorkspace == null) {
          if (formattedWorkspaces.length > 0) {
            fetchCurrentWorkspace(formattedWorkspaces[0].name);
          }
        } else {
          dispatch(setCurrentWorkspace(parsedLocalCurrentWorkspace));
        }
        dispatch(setWorkspaces(formattedWorkspaces));
      } else {
        createInitialWorkspace();
      }
      dispatch(setIsWorkspaceLoading(false));
    }
  }, [error, isLoading, res]);

  const changeCurrentWorkspace = (workspace: WorkspaceType) => {
    dispatch(setIsWorkspaceLoading(true));
    fetchCurrentWorkspace(workspace.name);
    dispatch(setIsWorkspaceLoading(false));
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
                    {/* {localStorage.getItem("currentWorkspace") || */}
                    {currentWorkspaceName}
                  </p>
                </div>
              </div>
              <ChevronsUpDown className="w-5 h-5 text-muted-foreground group-hover:text-secondary-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mt-3 ml-5 w-[26rem] h-fit z-50">
          <Card className="bg-card border dark:border-primary/50 border-border bg-gradient-to-l from-card to-card">
            <CardHeader>
              <CardTitle className="text-xl">Toggle Workspace</CardTitle>
              <CardDescription className="text-xs">
                Select the workspace you want to work with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isWorkspaceLoading && workspaces.length === 0 ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-muted-foreground text-sm">
                      Loading Workspaces...
                    </p>
                  </div>
                ) : !isWorkspaceLoading && workspaces.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    Create a workspace to get started.
                  </div>
                ) : (
                  <div className="text-muted-foreground gap-2">
                    <div className="flex flex-row gap-2 flex-wrap max-h-[200px] overflow-y-auto py-2">
                      {workspaces?.map((workspace: WorkspaceType) => (
                        <div
                          onClick={() => changeCurrentWorkspace(workspace)}
                          key={workspace.name}
                          className={cn(
                            "p-3 bg-neutral-200 dark:bg-sidebar/60 hover:cursor-pointer w-fit text-primry rounded-full  dark:hover:bg-sidebar hover:bg-primarytransition-all ease-in-out duration-300 text-sm",
                            {
                              "dark:bg-primary/50 bg-primary dark:hover:bg-primary/50 scale-[1.01] font-medium text-white":
                                workspace.name === currentWorkspaceName,
                            }
                          )}
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
                          "md:w-[250px] w-full text-muted-foreground font-normal hover:bg-sidebar-hover mb-1 hover:scale-[1.02] hover:text-black dark:hover:text-white",
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
        <Popover>
          <PopoverTrigger className="hover:bg-card rounded-lg p-1">
            <PersonalDetails />
          </PopoverTrigger>
          <PopoverContent className="w-[260px] mb-2">
            <Command>
              <CommandList>
                <CommandGroup heading="">
                  <CommandItem>
                    <ModeDashboardToggle />
                  </CommandItem>
                  <CommandItem>
                    <Button onClick={logout} className="w-full bg-card">
                      <div className="flex justify-start w-full items-center">
                        <User className="w-4 h-4 mr-4 text-muted-foreground dark:text-white" />
                        <p className="text-center text-muted-foreground dark:text-white">
                          Sign Out
                        </p>
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
        </div>
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
