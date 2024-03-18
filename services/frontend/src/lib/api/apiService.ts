import axios from "axios";

const apiClient = axios.create({
  baseURL:
    "http://fargat-farga-347sdllx4dpa-425634350.us-east-1.elb.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    console.log("Response: ", response.data);
  } catch (error: any) {
    console.log("Error fetching data", error);
  }
};
