import { apiClient } from "../apiService";

export const createDataset = async (workspaceName: string, name: string, description: string) => {
    try {

        const response = await apiClient.post(`/datasets/:${workspaceName}/dataset`, { name, description });

        console.log("Dataset created successfully: ", response.data);
    } catch (error) {
        console.error("Error creating workspace: ", error);
    }
};

export const fetchDatasets = async (workspaceName: string) => {
    try {

        const response = await apiClient.get(`/datasets/:${workspaceName}`);

        console.log("Datasets fetched successfully: ", response.data);
    } catch (error) {
        console.error("Error fetching Datasets: ", error);
    }
};

export const fetchDataset = async (workspaceName: string, datasetId: string) => {
    try {

        const response = await apiClient.get(`/datasets/:${workspaceName}/:${datasetId}`);

        console.log("Dataset fetched successfully: ", response.data);
    } catch (error) {
        console.error("Error fetching Dataset: ", error);
    }
};

export const addData = async (workspaceName: string, datasetId: string,data:any) => {
    try {

        const response = await apiClient.post(`/datasets/:${workspaceName}/:${datasetId}/data`,data);

        console.log("Data added successfully: ", response.data);
    } catch (error) {
        console.error("Error adding Data: ", error);
    }
};

export const getData = async (workspaceName: string, datasetId: string, dataId: string) => {
    try {

        const response = await apiClient.get(`/datasets/:${workspaceName}/:${datasetId}/data/${dataId}`);
        console.log("Data fetched successfully: ", response.data);
    } catch (error) {
        console.error("Error fetching Data: ", error);
    }
};