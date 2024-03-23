import { apiClient } from "../apiService";

export const createAssistantWithThread = async (workspaceName: string, purpose: string) => {
    try {

        const response = await apiClient.post(`/bot/${workspaceName}/assistant`, { purpose });

        console.log("Assistant created successfully: ", response.data);
    } catch (error) {
        console.error("Error creating Assistant: ", error);
    }
};

export const runAssistant = async (workspaceName: string, query: string) => {
    try {

        const response = await apiClient.post(`/datasets/:${workspaceName}/runAssistant`, { query });

        console.log("Datasets fetched successfully: ", response.data);
    } catch (error) {
        console.error("Error fetching Datasets: ", error);
    }
};
