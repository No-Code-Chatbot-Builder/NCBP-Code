"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useModal } from "@/providers/modal-provider";

const AddDataToDatasetForm = () => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const FormSchema = z.object({
    file: z.any().refine(
      (file) => {
        if (!(file instanceof FileList) || file.length === 0) {
          return false;
        }
        const fileItem = file[0];
        if (
          fileItem.size < 1024 * 1024 * 5 &&
          (fileItem.type === "application/pdf" ||
            fileItem.type === "application/json")
        ) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(fileItem);
          return true;
        }
        return false;
      },
      {
        message: "File must be a PDF or JSON and smaller than 5MB",
      }
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setClose();
    } catch (error) {
      console.log(error);
    }
  };
  const isLoading = form.formState.isSubmitting;

  return (
    <main className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-primary">File Upload</FormLabel>
                <FormControl>
                  <Controller
                    name="file"
                    control={form.control}
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <Input
                        type="file"
                        placeholder="Upload File"
                        accept=".pdf,.json"
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                        onBlur={onBlur}
                        name={name}
                        ref={ref}
                      />
                    )}
                  />
                </FormControl>
                {preview && (
                  <div className="mt-4">
                    <p>Preview:</p>
                    <Image
                      src={preview.toString()}
                      width={64}
                      height={64}
                      alt="File preview"
                    />
                  </div>
                )}
              </FormItem>
            )}
          />
          <div className="flex flex-row-reverse gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Upload File"
              )}
            </Button>
            <Button onClick={setClose} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default AddDataToDatasetForm;
