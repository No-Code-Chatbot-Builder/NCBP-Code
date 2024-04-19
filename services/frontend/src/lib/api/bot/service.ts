// import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import axios from "axios";

const BASE_URL = "http://localhost:3004";

const apiClient = axios.create({
  baseURL: BASE_URL,
  // timeout : 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createAssistantWithThread = async (
  workspaceName: string,
  name: string,
  purpose: string,
  model: string,
  tool: string
) => {
  console.log(workspaceName, name, purpose, model, tool);
  try {
    const response = await apiClient.post(`/bot/${workspaceName}/assistant`, {
      purpose: purpose,
      assistantName: name,
      tool: tool,
      models: model,
    });
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

export const retrieveAssistants = async (workspaceName: string) => {
  try {
    const response = await apiClient.get(`/bot/${workspaceName}`);
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
