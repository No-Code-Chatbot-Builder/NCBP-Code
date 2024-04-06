// import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import axios from "axios";

const BASE_URL = "http://localhost:3004";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  // timeout : 10000,
});

export const createAssistantWithThread = async (
  workspaceName: string,
  purpose: string
) => {
  try {
    const response = await apiClient.post(`/bot/${workspaceName}/assistant`, {
      purpose: purpose,
    });

    toast(
      CustomToast({
        title: "Assistant Creation",
        description: "Assistant created successfully.",
      })
    );
    return response.data;
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
    console.log("running...")
    console.log(workspaceName, query);
    const response = await apiClient.post(
      `/bot/${workspaceName}/runAssistant`,
      { query: query }
    );
    console.log(response);
    toast(
      CustomToast({
        title: "Success",
        description: "Assistant responded successfully.",
      })
    );
    return response.data;
  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error fetching Datasets.",
      })
    );
  }
};
