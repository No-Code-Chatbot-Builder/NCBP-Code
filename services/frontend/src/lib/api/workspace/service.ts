import { apiClient } from "../apiService";

export const createWorkspace = async (workspaceName: string) => {
    try {
        console.log("creating workspace", workspaceName)
        const response = await apiClient.post("/workspaces/", { name: workspaceName });
        console.log("Workspace created successfully: ", response.data);
    } catch (error) {
        console.error("Error creating workspace: ", error);
    }
};


export const editWorkspace = async (workspaceName: string, workspaceDescription: string, website: string) => {
    try {
        const response = await apiClient.put("/workspaces/", { workspaceName, workspaceDescription, website });

        console.log("Workspace updated successfully: ", response.data);
    } catch (error) {
        console.error("Error updating workspace: ", error);
    }
};


//connection remaining
export const deleteWorkspace = async (workspaceName: string) => {
    try {

        const response = await apiClient.delete("/workspaces/", { data: { workspaceName } });

        console.log("Workspace deleted successfully: ", response.data);
    } catch (error) {
        console.error("Error deleting workspace: ", error);
    }
};

//connection remaining
export const fetchWorkspace = async (workspaceName: string) => {
    try {

        const response = await apiClient.get("/workspaces/", { data: { workspaceName } });

        console.log("Workspace fetched successfully: ", response.data);
    } catch (error) {
        console.error("Error fetching workspace: ", error);
    }
};

export const fetchWorkspaces = async () => {
    try {

        const response = await apiClient.get("/users/");

        console.log("Workspace fetched successfully: ", response.data);
        return response.data.workspaces;
    } catch (error) {
        console.error("Error fetching workspace: ", error);
    }
};

//connection remaining
export const removeUserFromWorkspace = async (workspaceName: string) => {
    try {
        const response = await apiClient.put("/workspaces/remove", { workspaceName });

        console.log("User removed successfully: ", response.data);
    } catch (error) {
        console.error("Error removing user: ", error);
    }
};

export const inviteUser = async (workspaceName: string, userId: string, userEmail: string) => {
    try {
        const response = await apiClient.post("/workspaces/invite", { workspaceName, userId, userEmail });

        console.log("Workspace invitation sent successfully: ", response.data);
    } catch (error) {
        console.error("Error inviting user: ", error);
    }
};

export const respondInvite = async (userId: string, workspaceName: string, userResponse: string) => {
    try {
        const response = await apiClient.post("/workspaces/respond", { userId, workspaceName, userResponse });

        console.log("Invite userResponse successfully: ", response.data);
    } catch (error) {
        console.error("Error creating workspace: ", error);
    }
};