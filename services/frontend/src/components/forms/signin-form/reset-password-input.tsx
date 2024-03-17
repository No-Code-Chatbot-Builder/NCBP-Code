import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCustomAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react";
import { Input } from "@/components/ui/input";

const ResetPasswordInput = () => {
  const ResetPasswordSchema = z.object({
    newPassword: z
      .string()
      .min(6, "Your password must be atleast 6 characters."),
    confirmationCode: z
      .string()
      .min(6, "Your one-time password must be 6 characters."),
  });

  const resetPasswordForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    mode: "onChange",
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      confirmationCode: "",
      newPassword: "",
    },
  });

  const isLoadingResetPassword = resetPasswordForm.formState.isSubmitting;

  const { user, confirmAuthResetPassword } = useCustomAuth();

  async function handleConfirmResetPassword(
    values: z.infer<typeof ResetPasswordSchema>
  ) {
    await confirmAuthResetPassword({
      username: user?.email || "",
      confirmationCode: values.confirmationCode,
      newPassword: values.newPassword,
    });
  }
  return (
    <div>
      <div className="flex flex-col h-[100vh] justify-center px-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-sm text-secondary">
              We have sent you a reset code. Please check your email.
            </p>
          </div>
          <Button
            className="text-xs text-muted-foreground rounded-full bg-card"
            size={"sm"}
            onClick={() => {}}
          >
            Resend Code
          </Button>
        </div>
        <div className="mb-4" />
        <Form {...resetPasswordForm}>
          <form
            onSubmit={resetPasswordForm.handleSubmit(
              handleConfirmResetPassword
            )}
            className="space-y-4"
          >
            <FormField
              disabled={isLoadingResetPassword}
              control={resetPasswordForm.control}
              name="confirmationCode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-primary">
                    Reset Password Code
                  </FormLabel>

                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      render={({ slots }) => (
                        <InputOTPGroup className="gap-2">
                          {slots.map((slot, index) => (
                            <React.Fragment key={index}>
                              <InputOTPSlot
                                key={index}
                                {...slot}
                                className=" rounded-md border border-border"
                              />
                              {index !== slots.length - 1 && (
                                <InputOTPSeparator />
                              )}
                            </React.Fragment>
                          ))}{" "}
                        </InputOTPGroup>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-xs px-1" />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoadingResetPassword}
              control={resetPasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-primary">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                      className="border-border"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-xs px-1" />
                </FormItem>
              )}
            />
            <Button
              className="w-full p-6"
              type="submit"
              disabled={isLoadingResetPassword}
            >
              {isLoadingResetPassword ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordInput;
