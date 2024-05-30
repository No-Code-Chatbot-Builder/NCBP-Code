import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import axios from "axios";
import { apiClient } from "../apiService";

// export const botApiClient = axios.create({
//   baseURL: "http://localhost:3002/",
//   headers: { "Content-Type": "application/json" },
// });

export const createAssistantWithThread = async (
  workspaceName: string,
  name: string,
  purpose: string,
  model: string,
  tool: string,
  datasetId: string
) => {
  try {
    const body = {
      purpose: purpose,
      assistantName: name,
      tool: tool,
      models: model,
      dataSetId: datasetId,
    };
    console.log(body);
    const response = await apiClient.post(
      `/bot/${workspaceName}/assistant`,
      body
    );
    return response.data;
  } catch (error) {
    console.log(error);
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
    console.log("running...");
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
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: "Error fetching Datasets.",
      })
    );
  }
};

export const deleteAssistants = async (
  workspaceName: string,
  assistantId: string
) => {
  try {
    await apiClient.delete(`/bot/${workspaceName}`, {
      data: { assistantId: assistantId },
    });
    toast(
      CustomToast({
        title: "Success",
        description: "Assistant deleted successfully.",
      })
    );
    return { statusCode: 201 };
  } catch (error) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: "Error creating Assistant.",
      })
    );
    return { statusCode: 500 };
  }
};
