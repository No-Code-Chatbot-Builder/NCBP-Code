import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCustomAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerificationInput = () => {
  const VerificationSchema = z.object({
    verificationCode: z.string().min(1, "Verification code is required"),
  });

  const verificationform = useForm<z.infer<typeof VerificationSchema>>({
    mode: "onChange",
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const isLoadingValidation = verificationform.formState.isSubmitting;

  const { user, verifyCode, resendVerificationCode } = useCustomAuth();

  async function handleSignUpConfirmation(
    values: z.infer<typeof VerificationSchema>
  ) {
    await verifyCode({
      username: user?.email || "",
      code: values.verificationCode,
    });
  }
  return (
    <div>
      <div className="flex flex-col h-[100vh] justify-center px-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Enter The Verification Code</h1>
          <p className="text-sm text-secondary">Check your email.</p>
        </div>
        <div className="mb-4" />
        <Form {...verificationform}>
          <form
            onSubmit={verificationform.handleSubmit(handleSignUpConfirmation)}
            className="space-y-4"
          >
            <FormField
              disabled={isLoadingValidation}
              control={verificationform.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-primary">
                      Verification Code
                    </FormLabel>
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
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the code"
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
