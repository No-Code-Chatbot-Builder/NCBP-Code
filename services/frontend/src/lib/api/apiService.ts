import axios from "axios";

const apiClient = axios.create({
  baseURL:
    "http://fargat-farga-347sdllx4dpa-425634350.us-east-1.elb.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
    "TOKEN": "Bearer acess token",
  },
});

export const createWorkspace = async () => {
  try {
    const workspaceData = {
      name: "IntegrationWorkspace",
      userId: "24a85488-1041-7031-0713-99f4aaab50a1",
      userEmail: "hash.hussain53@gmail.com",
    };

    const response = await apiClient.post("/workspaces/", workspaceData);
    
    console.log("Workspace created successfully: ", response.data);
  } catch (error) {
    console.error("Error creating workspace: ", error);
  }
};


export const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    console.log("Response: ", response.data);
  } catch (error: any) {
    console.log("Error fetching data", error);
  }
};

