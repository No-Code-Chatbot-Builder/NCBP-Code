import { apiClient } from "../apiService";

export const createWorkspace = async (workspaceName: string, userId: string, userEmail: string) => {
    try {

        const response = await apiClient.post("/workspaces/", { workspaceName, userId, userEmail });

        console.log("Workspace created successfully: ", response.data);
    } catch (error) {
        console.error("Error creating workspace: ", error);
    }
};


export const editWorkspace = async (workspaceId: string, workspaceName: string, workspaceDescription: string) => {
    try {
        const workspaceData = {
            workspaceName: "IntegrationWorkspace",
            userId: "24a85488-1041-7031-0713-99f4aaab50a1",
            userEmail: "hash.hussain53@gmail.com",
            members: "",
            website: "",
            description: "",
            createdAt: "",
        };

        const response = await apiClient.put("/workspaces/", workspaceData);

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
//connection remaining
export const removeUserFromWorkspace = async (userId: string, workspaceName: string) => {
    try {
        const response = await apiClient.put("/workspaces/remove", { userId, workspaceName });

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

export const respondInvite = async (userId:string,workspaceName:string,userResponse:string) => {
    try {
        const response = await apiClient.post("/workspaces/respond", {userId,workspaceName,userResponse});

        console.log("Invite userResponse successfully: ", response.data);
    } catch (error) {
        console.error("Error creating workspace: ", error);
    }
};