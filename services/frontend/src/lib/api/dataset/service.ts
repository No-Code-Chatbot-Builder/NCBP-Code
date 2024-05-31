import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";
import axios from "axios";

// const BASE_URL = "http://localhost:3001";

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// apiClient.interceptors.request.use(
//   async (config) => {
//     const token = sessionStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (config.method === "delete" && config.data) {
//       config.headers["Content-Type"] = "application/json";
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

//tested
export const createDataset = async (
  currentWorkspaceName: string,
  name: string,
  description: string
) => {
  try {
    const response = await apiClient.post(`/datasets/${currentWorkspaceName}`, {
      name: name,
      description: description,
    });

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

//tested
export const updateDatasets = async (
  currentWorkspaceName: string,
  datasetId: string,
  name: string,
  description: string
) => {
  try {
    const response = await apiClient.put(
      `/datasets/${currentWorkspaceName}/${datasetId}`,
      { name: name, description: description }
    );

    toast(
      CustomToast({
        title: "Success",
        description: "Dataset updated successfully.",
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
//tested
export const deleteDataset = async (
  currentWorkspaceName: string,
  datasetId: string
) => {
  try {
    const response = await apiClient.delete(
      `/datasets/${currentWorkspaceName}/${datasetId}`
    );
    toast(
      CustomToast({
        title: "Success",
        description: "All datasets deleted successfully.",
      })
    );
    return {statusCode : 201};
  } catch (error: any) {
    toast(
      CustomToast({
        title: "Error",
        description: `Error deleting all datasets. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
    console.log(error);
    return {statusCode : 500};

  }
};

export const deleteDatsetById = async ({
  currentWorkspaceName,
  datasetId,
}: {
  currentWorkspaceName: string;
  datasetId: string;
}) => {
  try {
    const response = await apiClient.delete(
      `/datasets/${currentWorkspaceName}/${datasetId}`
    );

    return response.data;
  } catch (error: any) {
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

//tested
export const getDatasets = async (workspaceName: string) => {
  try {
    const response = await apiClient.get(`/datasets/${workspaceName}/`);

    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

//tested
export const fetchFiles = async (workspaceName: string, datasetId: string) => {
  console.log(workspaceName, datasetId);
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

//tested
export const addData = async (
  workspaceName: string,
  datasetId: string,
  data: FormData
) => {
  try {
    const response = await apiClient.post(
      `/datasets/${workspaceName}/${datasetId}/data`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

//tested
export const deleteData = async (
  currentWorkspaceName: string,
  datasetId: string,
  dataId: string
) => {
  try {
    await apiClient.delete(
      `/datasets/${currentWorkspaceName}/${datasetId}/data/${dataId}`
    );
    toast(
      CustomToast({
        title: "Success",
        description: "Dataset deleted successfully.",
      })
    );
    return { statusCode: 201 };
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
    return { statusCode: 500 };
  }
};

export const getData = async (
  workspaceName: string,
  datasetId: string,
  dataId: string
) => {
  try {
    const response = await apiClient.get(
      `/datasets/${workspaceName}/${datasetId}/data/${dataId}`
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

export const deleteAllDatasets = async (workspaceName: string) => {
  try {
    const response = await apiClient.delete(`/datasets/${workspaceName}`);
    toast(
      CustomToast({
        title: "Success",
        description: "All datasets deleted successfully.",
      })
    );
    return { statusCode: 201 };
  } catch (error: any) {
    toast(
      CustomToast({
        title: "Error",
        description: `Error deleting all datasets. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
    console.log(error);
    return { statusCode: 500 };
  }
};
