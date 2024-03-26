import { apiClient } from "../apiService";

export const createDataset = async (
  currentWorkspaceName: string,
  name: string,
  description: string
) => {
  try {
    console.log("currentWorkspaceName: ", currentWorkspaceName);
    console.log("name: ", name);
    console.log("description: ", description);

    const response = await apiClient.post(
      "/datasets/IntegrationWorkspace/dataset/",
      { name: name, description: description }
    );

    console.log("Dataset created successfully: ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating Dataset: ", error.response || error);
  }
};

export const fetchDatasets = async (workspaceName: string) => {
  try {
    // const response = await apiClient.get(`/datasets/${workspaceName}`);
    console.log("fetching....");
    const response = await apiClient.get("/datasets/IntegrationWorkspace/");
    console.log("Datasets fetched successfully: ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Dataset: ", error.response || error);
  }
};

export const fetchFiles = async (workspaceName: string, datasetId: string) => {
  try {
    const response = await apiClient.get(
      `/datasets/IntegrationWorkspace/${datasetId}`
    );

    console.log("Dataset fetched successfully: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Dataset: ", error);
  }
};

export const addData = async (
  workspaceName: string,
  datasetId: string,
  data: any
) => {
  try {
    const response = await apiClient.post(
      `/datasets/IntegrationWorkspace/${datasetId}/data`,
      data
    );
    console.log("Data added successfully: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding Data: ", error);
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
    console.log("Data fetched successfully: ", response.data);
  } catch (error) {
    console.error("Error fetching Data: ", error);
  }
};
