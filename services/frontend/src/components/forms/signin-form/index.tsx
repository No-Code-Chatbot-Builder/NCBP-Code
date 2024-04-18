"use client";

import React from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import SocialSignInButtons from "@/components/site/auth/social-sign-in-buttons";
import { useCustomAuth } from "@/providers/auth-provider";
import VerificationInput from "../signup-form/verification-input";
import ResetPasswordInput from "./reset-password-input";

const SignUpInput = () => {
  const { login, resetAuthPassword } = useCustomAuth();
  const FormSchema = z.object({
    email: z
      .string()
      .min(5, {
        message: "Email must be at least 5 characters long",
      })
      .email({ message: "The email you entered is invalid" }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const watchedEmail = form.watch("email");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    await login({ username: values.email, password: values.password });
  };
  return (
    <div>
      {" "}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Sign In to NoCodeBot.ai</h1>
            <p className="text-sm text-secondary">
              Please enter your login details below.
            </p>
          </div>
          <Button
            className="text-xs text-muted-foreground rounded-full bg-card"
            size={"sm"}
            onClick={() => {
              resetAuthPassword({ username: watchedEmail });
            }}
          >
            Forgot Password
          </Button>
        </div>
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="border-border pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <button
                        type="button"
                        className="text-muted-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <Button className="w-full p-6" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In"
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
        <div className="text-sm text-secondary">
          Dont have an account?{" "}
          <Link href="sign-up" className="hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

const SignInForm = () => {
  const { isVerificationStep, isPasswordReset } = useCustomAuth();

  return (
    <div className="flex flex-col h-[100vh] justify-center px-10">
      {isVerificationStep ? (
        <VerificationInput />
      ) : isPasswordReset ? (
        <ResetPasswordInput />
      ) : (
        <SignUpInput />
      )}
    </div>
  );
};

export default SignInForm;
