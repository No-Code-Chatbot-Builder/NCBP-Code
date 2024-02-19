import InviteUsersForm from "@/components/forms/invite-users-form";
import ManageWorkspaceForm from "@/components/forms/manage-workspace-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="mt-20">
      <div className="">
        <Tabs defaultValue="workspace" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary/50 mb-10">
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="workspace">
            <ManageWorkspaceForm />
            <InviteUsersForm />
          </TabsContent>
          <TabsContent value="subscriptions">
            Change your password here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
