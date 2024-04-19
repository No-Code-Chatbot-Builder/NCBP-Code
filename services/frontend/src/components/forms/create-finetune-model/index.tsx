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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useModal } from "@/providers/modal-provider";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import { DatasetType } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const CreateFineTuneModelForm = () => {
  const dispatch = useAppDispatch();
  const { setClose } = useModal();

  const FormSchema = z.object({
    name: z
      .string()
      .min(5, { message: "Name must contain atleast 5 characters long" }),
    base_model: z.string().min(5, {
      message: "Description must contain atleast 5 characters long",
    }),
    dataset: z.string().min(1, { message: "Select the dataset" }),
    batch_size: z.string().min(1, { message: "Enter batch size" }),
    no_epochs: z.string().min(1, { message: "Enter numbers of epochs" }),
    lr: z.string().min(1, { message: "Enter learning rate" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      dataset: "",
      base_model: "",
      batch_size: "1",
      no_epochs: "1",
      lr: "0.1",
    },
  });

  const datasets = useAppSelector((state) => state.datasets.datasets);

  const [isBatchSizeEnabled, setIsBatchSizeEnabled] = useState(false);
  const [batchSize, setBatchSize] = useState("1");
  const [isEpochEnabled, setIsEpochEnabled] = useState(false);
  const [epoch, setEpoch] = useState("1");
  const [isLREnabled, setIsLREnabled] = useState(false);
  const [lr, setLR] = useState("0.1");

  const handleBatchSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBatchSize(event.target.value);
    form.setValue("batch_size", event.target.value);
  };

  const toggleBatchSizeEnabled = (checked: boolean) => {
    setIsBatchSizeEnabled(checked);
    form.setValue("batch_size", checked ? batchSize : "auto");
  };

  const handleEpochChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEpoch(event.target.value);
    form.setValue("no_epochs", event.target.value);
  };

  const toggleEpochEnabled = (checked: boolean) => {
    setIsEpochEnabled(checked);
    if (!checked) {
      form.setValue("no_epochs", "auto");
    }
  };

  const handleLRChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLR(event.target.value);
    form.setValue("lr", event.target.value);
  };

  const toggleLREnabled = (checked: boolean) => {
    setIsLREnabled(checked);
    if (!checked) {
      form.setValue("lr", "auto");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <main className="mt-4">
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-secondary">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the assistant name" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="dataset"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-secondary">Dataset</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value: string) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select knowledge base of your assistant" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.map((dataset: DatasetType) => (
                        <SelectItem value={dataset.id} key={dataset.id}>
                          {dataset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="base_model"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-secondary">Base Model</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value: string) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select base model to perform fine tune on" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="babbage-002">babbage-002</SelectItem>
                      <SelectItem value="davinci-002">davinci-002</SelectItem>
                      <SelectItem value="gpt-3.5-turbo-0125">
                        gpt-3.5-turbo-0125
                      </SelectItem>
                      <SelectItem value="gpt-3.5-turbo-0613">
                        gpt-3.5-turbo-0613
                      </SelectItem>
                      <SelectItem value="gpt-3.5-turbo-1106">
                        gpt-3.5-turbo-1106 - latest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="batch_size"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-secondary">Batch Size</FormLabel>
                <FormControl>
                  <div>
                    <div className="flex justify-between items-center">
                      <Checkbox
                        checked={isBatchSizeEnabled}
                        onCheckedChange={toggleBatchSizeEnabled}
                        disabled={isLoading}
                      />

                      <Input
                        type="text"
                        className="w-16 h-8"
                        disabled={!isBatchSizeEnabled || isLoading}
                        value={isBatchSizeEnabled ? batchSize : "auto"}
                        onChange={handleBatchSizeChange}
                      />
                    </div>
                    {isBatchSizeEnabled && (
                      <Slider
                        min={1}
                        max={32}
                        step={1}
                        value={[parseInt(batchSize.toString(), 10)]}
                        onValueChange={(value) =>
                          handleBatchSizeChange({
                            target: { value: value.toString() },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="mt-4"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="no_epochs"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-secondary">No. of Epochs</FormLabel>
                <FormControl>
                  <div>
                    <div className="flex justify-between items-center">
                      <Checkbox
                        checked={isEpochEnabled}
                        onCheckedChange={toggleEpochEnabled}
                        disabled={isLoading}
                      />

                      <Input
                        type="text"
                        className="w-16 h-8"
                        disabled={!isEpochEnabled || isLoading}
                        value={isEpochEnabled ? epoch : "auto"}
                        onChange={handleEpochChange}
                      />
                    </div>
                    {isEpochEnabled && (
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[parseInt(epoch.toString(), 10)]}
                        onValueChange={(value) =>
                          handleEpochChange({
                            target: { value: value.toString() },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        disabled={isLoading}
                        className="mt-4"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-xs px-1" />
              </FormItem>
            )}
          />

          <FormField
            disabled={isLoading}
            control={form.control}
            name="lr"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-secondary">Learning Rate</FormLabel>
                <FormControl>
                  <div>
                    <div className="flex justify-between items-center">
                      <Checkbox
                        checked={isLREnabled}
                        onCheckedChange={toggleLREnabled}
                        disabled={isLoading}
                      />

                      <Input
                        type="text"
                        className="w-16 h-8"
                        disabled={!isLREnabled || isLoading}
                        value={isLREnabled ? lr : "auto"}
                        onChange={handleLRChange}
                      />
                    </div>
                    {isLREnabled && (
                      <Slider
                        min={1}
                        max={10}
                        step={0.1}
                        value={[parseFloat(lr)]}
                        onValueChange={(value) =>
                          handleLRChange({
                            target: { value: value.toString() },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        disabled={isLoading}
                        className="mt-4"
                      />
                    )}
                  </div>
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
                "Start Fine Tuning"
              )}
            </Button>
            <Button
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault();
                setClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default CreateFineTuneModelForm;
