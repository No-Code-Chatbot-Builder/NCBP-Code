import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import axios from "axios";

// const BASE_URL = "http://localhost:3011";

// export const botApiClient = axios.create({
//   baseURL: BASE_URL,
// });

// botApiClient.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem("token");
//     console.log(token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
    const response = await apiClient.delete(
      `/bot/${workspaceName}/${assistantId}`
    );
    toast(
      CustomToast({
        title: "Success",
        description: "Assistant deleted successfully.",
      })
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
