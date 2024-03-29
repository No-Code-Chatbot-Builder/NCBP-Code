import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";

export const createDataset = async (
  currentWorkspaceName: string,
  name: string,
  description: string
) => {
  try {
    const response = await apiClient.post(
      `/datasets/${currentWorkspaceName}/dataset/`,
      { name: name, description: description }
    );

    toast(
      CustomToast({
        title: "Success",
        description: "Dataset created successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error creating Dataset. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const fetchDatasets = async (workspaceName: string) => {
  try {
    const response = await apiClient.get(`/datasets/${workspaceName}/`);
    toast(
      CustomToast({
        title: "Success",
        description: "Datasets fetched successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching Dataset. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const fetchFiles = async (workspaceName: string, datasetId: string) => {
  try {
    const response = await apiClient.get(
      `/datasets/${workspaceName}/${datasetId}`
    );

    toast(
      CustomToast({
        title: "Success",
        description: "Dataset fetched successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching Dataset. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const addData = async (
  workspaceName: string,
  datasetId: string,
  data: any
) => {
  try {
    const response = await apiClient.post(
      `/datasets/${workspaceName}/${datasetId}/data`,
      data
    );
    toast(
      CustomToast({
        title: "Success",
        description: "Data added successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error adding Data. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const getData = async (
  workspaceName: string,
  datasetId: string,
  dataId: string
) => {
  try {
    const response = await apiClient.get(
      `/datasets/:${workspaceName}/${datasetId}/data/${dataId}`
    );
    toast(
      CustomToast({
        title: "Success",
        description: "Data fetched successfully.",
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching Data. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};
