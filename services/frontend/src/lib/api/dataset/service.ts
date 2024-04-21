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
      `/dataset-service/datasets/${currentWorkspaceName}`,
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

export const deleteDataset = async (
  currentWorkspaceName: string,
  datasetId: string
) => {
  try {
    const response = await apiClient.delete(
      `/dataset-service/datasets/${currentWorkspaceName}/dataset/${datasetId}`
    );
    toast(
      CustomToast({
        title: "Success",
        description: "Dataset deleted successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error deleting Dataset. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const getDatasets = async (workspaceName: string) => {
  try {
    const response = await apiClient.get(
      `/dataset-service/datasets/${workspaceName}/`
    );

    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchFiles = async (workspaceName: string, datasetId: string) => {
  console.log(workspaceName, datasetId);
  try {
    const response = await apiClient.get(
      `/dataset-service/datasets/${workspaceName}/${datasetId}`
    );

    toast(
      CustomToast({
        title: "Success",
        description: "Dataset fetched successfully.",
      })
    );
    console.log(response.data);
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
      `/dataset-service/datasets/${workspaceName}/${datasetId}/data`,
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
      `/dataset-service/datasets/${workspaceName}/${datasetId}/data/${dataId}`
    );
    toast(
      CustomToast({
        title: "Success",
        description: "Data fetched successfully.",
      })
    );
    return response.data;
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
