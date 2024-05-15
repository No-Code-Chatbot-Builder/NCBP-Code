import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/providers/modal-provider";
import CustomToast from "@/components/global/custom-toast";
import { inviteUser } from "@/lib/api/workspace/service";
import { useAppSelector } from "@/lib/hooks";

const InviteNewUserForm = () => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );

  const FormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
  });

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await inviteUser(currentWorkspaceName!, values.email);
      toast(
        CustomToast({
          title: "User Invited",
          description:
            "User has been invited successfully. They will receive an email with the invitation link.",
        })
      );
    } catch (error) {
      toast(
        CustomToast({
          title: "Error During Invitation",
          description:
            "An error occurred while inviting the user. Please try again.",
        })
      );
    }
  };

  return (
    <main className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the email of the user you want to invite."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Invite User"
              )}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setClose();
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default InviteNewUserForm;
