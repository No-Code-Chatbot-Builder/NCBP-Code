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
import { CalendarIcon, Eye, EyeOff, Loader2 } from "lucide-react";
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

import { useCustomAuth } from "@/providers/auth-provider";
import VerificationInput from "./verification-input";

const SignUpForm = () => {
  const { isVerificationStep } = useCustomAuth();
  return (
    <div className="flex flex-col h-[100vh] justify-center px-10">
      {isVerificationStep ? <VerificationInput /> : <SignUpInput />}
    </div>
  );
};

export default SignUpForm;

const SignUpInput = () => {
  const { signup } = useCustomAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    preferred_username: z
      .string()
      .min(1, "Please enter your preferred username"),
    given_name: z.string().min(1, "Please enter your name"),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      birthdate: new Date(),
      address: "",
      preferred_username: "",
      given_name: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    await signup({
      email: values.email,
      password: values.password,
      birthdate: values.birthdate,
      address: values.address,
      preferred_username: values.preferred_username,
      given_name: values.given_name,
    });
  };
  return (
    <div className="">
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...field}
                      className="border-border"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <button
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
                          "w-full justify-between text-left font-normal bg-background hover:scale-100 hover:bg-background",
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
          <FormField
            disabled={isLoading}
            control={form.control}
            name="preferred_username"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">
                  Preferred Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your preferred username"
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
            name="given_name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">Given Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name."
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

      <div className="flex items-center justify-center space-x-2 mt-4">
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
