import axios, { AxiosError } from "axios";

const BASE_URL =
  "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    TOKEN: "Bearer 1234567890",
  },
});



export const fetchUsers = async (): Promise<void> => {
  try {
    const { data } = await apiClient.get("/users");
    console.log("Response: ", data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching data",
        error.response?.data || error.message
      );
    } else {
      console.error("An unexpected error occurred", error);
    }
  }
};

