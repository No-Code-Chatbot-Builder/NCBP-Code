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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import SocialSignInButtons from "@/components/site/auth/social-sign-in-buttons";
import { useRouter } from "next/navigation";
import { signIn } from "aws-amplify/auth";

const SignInForm = () => {
  const { toast } = useToast();
  const FormSchema = z.object({
    email: z
      .string()
      .min(5, {
        message: "Email must be at least 5 characters long",
      })
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
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const { isSignedIn } = await signIn({
        username: values.email,
        password: values.password,
      });
      if (isSignedIn) router.push("/dashboard");
    } catch (error) {
      console.log(`Error signing in user: ${error}`);
    }
  };

  return (
    <div className="flex flex-col h-[100vh] justify-center px-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sign In to NoCodeBot.ai</h1>
        <p className="text-sm text-secondary">
          Please enter your login details below.
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
                  <Input placeholder="Enter your email" {...field} />
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
                    placeholder="Enter your password"
                    {...field}
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

export default SignInForm;
