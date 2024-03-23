import { apiClient } from "../apiService";

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
  

  export const editWorkspace = async () => {
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