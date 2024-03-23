import axios, { AxiosError } from "axios";

const BASE_URL =
  "http://fargat-farga-347sdllx4dpa-425634350.us-east-1.elb.amazonaws.com";

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

