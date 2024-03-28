import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";

export const createAssistantWithThread = async (
  workspaceName: string,
  purpose: string
) => {
  try {
    const response = await apiClient.post(`/bot/${workspaceName}/assistant`, {
      purpose,
    });

    toast(
      CustomToast({
        title: "Assistant Creation",
        description: "Assistant created successfully.",
      })
    );
  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error creating Assistant.",
      })
    );
  }
};

export const runAssistant = async (workspaceName: string, query: string) => {
  try {
    const response = await apiClient.post(
      `/datasets/:${workspaceName}/runAssistant`,
      { query }
    );

    toast(
      CustomToast({
        title: "Success",
        description: "Datasets fetched successfully.",
      })
    );
  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error fetching Datasets.",
      })
    );
  }
};
