"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import {
  addFile,
  setIsDatasetFilesEmpty,
} from "@/providers/redux/slice/datasetSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useModal } from "@/providers/modal-provider";
import CustomToast from "@/components/global/custom-toast";
import { addData } from "@/lib/api/dataset/service";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

interface AddDataToDatasetFormProps {
  workspaceName: string;
  datasetId: string;
}

const AddDataToDatasetForm = ({
  workspaceName,
  datasetId,
}: AddDataToDatasetFormProps) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const dispatch = useAppDispatch();
  const FormSchema = z.object({
    file: z.any().refine(
      (file) => {
        if (!(file instanceof FileList) || file.length === 0) {
          return false;
        }
        const fileItem = file[0];
        const allowedTypes = [
          "application/json",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
        ];
        return allowedTypes.includes(fileItem.type);
      },
      {
        message: "File must be a JSON, Word, PPT, or TXT file",
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
    const file = values.file[0];
    console.log(file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await addData(workspaceName, datasetId, formData);
      console.log(res);
      if (
        res.responseForAddingData.success &&
        res.responseForAddingFileNameUUID.success
      ) {
        const addFilePayload = {
          datasetId: datasetId,
          data: {
            id: res.responseForAddingFileNameUUID.fileId,
            name: file.name,
            path: res.responseForAddingData.dataDetails.path,
            createdAt: new Date().toISOString(),
            createdBy: "User",
          },
        };
        console.log(addFilePayload);
        dispatch(addFile(addFilePayload));
        dispatch(setIsDatasetFilesEmpty(false));
      } else {
        console.error(
          "Error adding data:",
          res?.responseForAddingData?.message,
          res?.responseForAddingFileNameUUID?.message
        );
      }
      setClose();
      toast(
        CustomToast({
          title: "File Uploaded",
          description: "Your File has been uploaded",
        })
      );
    } catch (error) {
      toast(
        CustomToast({
          title: "Error During File Upload",
          description: "An error occured while uploading the file.",
        })
      );
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
                        accept=".docx,.txt,.pdf,.pptx,.json,.doc,.ppt"
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

export default AddDataToDatasetForm;
