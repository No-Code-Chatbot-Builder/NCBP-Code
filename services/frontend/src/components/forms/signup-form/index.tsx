"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import SocialSignInButtons from "@/components/site/auth/social-sign-in-buttons";
import { signUp } from "aws-amplify/auth";
import { confirmSignUp, type ConfirmSignUpInput } from "aws-amplify/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Error from "next/error";

const SignUpForm = () => {
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [emailForV, setEmailForV] = useState("");

  return (
    <div className="flex flex-col h-[100vh] justify-center px-10">
      {isVerificationStep ? (
        <VerificationStuff email={emailForV} />
      ) : (
        <SignUpStuff
          onSignUp={(email) => {
            setIsVerificationStep(true);
            setEmailForV(email);
          }}
        />
      )}
    </div>
  );
};

export default SignUpForm;

const VerificationStuff = ({ email }: { email: string }) => {
  const router = useRouter();
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
  async function handleSignUpConfirmation(
    values: z.infer<typeof VerificationSchema>
  ) {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: values.verificationCode,
      });
      if (isSignUpComplete) {
        toast("email verified");
        router.push("/dashboard");
        verificationform.reset();
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast(
        <div className="grid gap-2">
          <h3 className="font-bold text-lg">Error Signing Up</h3>
          <p className="text-muted-foreground text-sm">{error.toString()}</p>
        </div>
      );
    }
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
                  <FormLabel className="text-primary">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the code" />
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

interface SignUpStuffProps {
  onSignUp: (email: string) => void;
}

const SignUpStuff = ({ onSignUp }: SignUpStuffProps) => {
  const FormSchema = z.object({
    email: z
      .string()
      .min(5, { message: "Email must be at least 5 characters long" })
      .email("Enter a valid Email Address"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),
    birthdate: z.date({ required_error: "Please enter your date of birth" }),
    address: z.string().min(1, "Please enter your address"),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      birthdate: new Date(),
      address: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const formattedBirthdate = format(values.birthdate, "yyyy-MM-dd");

      const { isSignUpComplete } = await signUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            email: values.email,

            birthdate: formattedBirthdate,
            address: values.address,

            preferred_username: values.email.split("@")[0],
            given_name: "YourGivenName",
          },
        },
      });

      onSignUp(values.email);
      form.reset();
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast(
        <div className="grid gap-2">
          <h3 className="font-bold text-lg">Error Signing Up</h3>
          <p className="text-muted-foreground text-sm">{error.toString()}</p>
        </div>
      );
    }
  };
  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sign up for NoCodeBot.ai</h1>
        <p className="text-sm text-secondary">
          Fill in the details below to create your account.
        </p>
      </div>
      <div className="mb-4" />
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
                    placeholder="Enter your email"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1">
                <FormLabel className="text-primary">Date of birth</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl className="w-full">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-between text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-xs text-muted-foreground">
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your address"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <Button className="w-full p-6" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-secondary/50"></div>
        <span className="flex-shrink mx-4 text-secondary/50 text-sm">
          or continue with
        </span>
        <div className="flex-grow border-t border-secondary/50"></div>
      </div>
      <div>
        <SocialSignInButtons />
      </div>
      <div className="flex items-center justify-center space-x-2">
        {/* Social Sign Up Links */}
        <div className="text-sm text-secondary">
          Already have an account?{" "}
          <Link href="/sign-in" className="hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
