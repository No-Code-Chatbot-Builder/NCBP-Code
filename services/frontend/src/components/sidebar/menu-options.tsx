"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { ChevronsUpDown, Menu, Plus, PlusCircle, Settings } from "lucide-react";
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
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ModeToggle } from "../global/mode-toggle";
import { ModeDashboardToggle } from "../global/mode-dashboard";
import CustomModel from "../global/custom-model";
import CreateWorkspaceForm from "../forms/create-workspace";

type Props = {
  defaultOpen?: boolean;
  sidebarOpt: SidebarOption[];
  id: string;
};

const MenuOptions = ({ id, sidebarOpt, defaultOpen }: Props) => {
  const { setOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const pathname = usePathname();

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
                          Workspace 1
                        </p>
                      </div>
                    </div>
                    <ChevronsUpDown className="w-5 h-5 text-muted-foreground group-hover:text-secondary-foreground" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mt-2 w-64 h-fit z-50">
                <Card className="border-2 border-text-muted">
                  <CardHeader>
                    <CardTitle className="text-xl">Change Workspace</CardTitle>
                    <CardDescription className="text-xs">
                      Select the workspace you want to work with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-muted-foreground">
                        No new workspaces
                      </div>
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
                    <div className="px-4 py-2" key={sidebarOption.heading}>
                      <h3 className="text-sm text-primary font-medium">
                        {sidebarOption.heading}
                      </h3>
                    </div>
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
                                "bg-sidebar-hover text-sidebar-foreground  ":
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
                <PopoverContent></PopoverContent>
              </Popover>
            </section>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
