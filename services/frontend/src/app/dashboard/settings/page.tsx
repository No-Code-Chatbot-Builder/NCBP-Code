"use client";

import ManageUsersCard from "@/components/forms/workspace-users-table";
import ManageWorkspaceCard from "@/components/forms/manage-workspace-form";
import PricingCards from "@/components/pricing/pricing-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Delete, Settings } from "lucide-react";
import DeleteWorkspaceCard from "@/components/forms/delete-workspace-form";
import DeleteAllDatasetsCard from "@/components/forms/delete-all-datasets";
import ManagePendingInvitesCard from "@/components/forms/manage-pending-invites-form";
import { useEffect, useState } from "react";
import {
  fetchWorkspaceUsers,
  getPendingInvites,
} from "@/lib/api/workspace/service";
import { Membership } from "@/lib/constants";
import { useAppSelector } from "@/lib/hooks";
import {
  WorkspaceUserType,
  setWorkspaceUsers,
} from "@/providers/redux/slice/workspaceSlice";
import { useDispatch } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetchWorkspaceUsers(currentWorkspaceName!);
        console.log(response);
        const users: WorkspaceUserType[] = response.membership.map(
          (user: any) => ({
            role: user.role,
            userEmail: user.userEmail,
            userId: user.userId,
            workspaceName: user.workspaceName,
          })
        );
        dispatch(setWorkspaceUsers(users));
        response = await getPendingInvites();
        setMemberships(response.membership);
      } catch (error: any) {
        console.log(error);
      }
    }
    if (currentWorkspaceName != null) fetchData();
  }, [currentWorkspaceName, dispatch]);
  return (
    <div className="flex flex-col gap-10">
      <div>
        <section className="mt-20 flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Settings className="w-5 h-5" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-md text-muted-foreground">
            Manage your account and workspace settings here
          </p>
        </section>
        <Separator className="mt-8" />
      </div>

      <div className="">
        <Tabs defaultValue="workspace" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-10">
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="invites">
            <ManagePendingInvitesCard memberships={memberships} />
          </TabsContent>
          <TabsContent value="workspace">
            <ManageWorkspaceCard />
            <ManageUsersCard />
            <DeleteAllDatasetsCard />
            <DeleteWorkspaceCard />
          </TabsContent>

          <TabsContent value="subscriptions">
            <PricingCards />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
