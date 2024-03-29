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

const VerificationInput = () => {
  const VerificationSchema = z.object({
    pin: z.string().min(6, "Your one-time password must be 6 characters."),
  });

  const verificationform = useForm<z.infer<typeof VerificationSchema>>({
    mode: "onChange",
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      pin: "",
    },
  });

  const isLoadingValidation = verificationform.formState.isSubmitting;

  const { user, verifyCode, resendVerificationCode } = useCustomAuth();

  async function handleSignUpConfirmation(
    values: z.infer<typeof VerificationSchema>
  ) {
    await verifyCode({
      username: user?.email || "",
      code: values.pin,
    });
  }
  return (
    <div>
      <div className="flex flex-col h-[100vh] justify-center px-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Enter The Verification Code</h1>
            <p className="text-sm text-secondary">
              We have sent you a verification code. Please check your email.
            </p>
          </div>
          <Button
            className="text-xs text-muted-foreground rounded-full bg-card"
            size={"sm"}
            onClick={() =>
              resendVerificationCode({
                username: user?.email || "",
              })
            }
          >
            Resend Code
          </Button>
        </div>
        <div className="mb-4" />
        <Form {...verificationform}>
          <form
            onSubmit={verificationform.handleSubmit(handleSignUpConfirmation)}
            className="space-y-8"
          >
            <FormField
              disabled={isLoadingValidation}
              control={verificationform.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-primary">
                    Verification Code
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
            <Button
              className="w-full p-6"
              type="submit"
              disabled={isLoadingValidation}
            >
              {isLoadingValidation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerificationInput;
