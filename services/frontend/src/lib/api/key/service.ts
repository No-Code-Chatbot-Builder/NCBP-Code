import { apiClient } from "../apiService";

export const createKey = async (accessMode: string) => {
    try {

        const response = await apiClient.post('/keys/', {accessMode});

        console.log("key created successfully: ", response.data);
    } catch (error) {
        console.error("Error creating key: ", error);
    }
};

export const deleteKey = async (clientId:string) => {
    try {

        const response = await apiClient.delete(`/keys/${clientId}`);

        console.log("key deleted successfully: ", response.data);
    } catch (error) {
        console.error("Error deleting key: ", error);
    }
};

export const getKeys = async () => {
    try {

        const response = await apiClient.get('/keys/');

        console.log("key deleted successfully: ", response.data);
    } catch (error) {
        console.error("Error deleting key: ", error);
    }
};
