import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";

export const createWorkspace = async (workspaceName: string) => {
  try {
    const response = await apiClient.post("/workspaces/", {
      name: workspaceName,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Workspace ${workspaceName} created successfully.`,
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error creating workspace: ${workspaceName}. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const editWorkspace = async (
  workspaceName: string,
  workspaceDescription: string,
  website: string
) => {
  try {
    const response = await apiClient.put("/workspaces/", {
      workspaceName,
      workspaceDescription,
      website,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Workspace ${workspaceName} updated successfully.`,
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error updating workspace: ${workspaceName}. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

//connection remaining
export const deleteWorkspace = async (workspaceName: string) => {
  try {
    const response = await apiClient.delete("/workspaces/", {
      data: { workspaceName },
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Workspace ${workspaceName} deleted successfully.`,
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error deleting workspace: ${workspaceName}. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

//connection remaining
export const fetchWorkspace = async (workspaceName: string) => {
  try {
    const response = await apiClient.get("/workspaces/", {
      data: { workspaceName },
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Workspace ${workspaceName} fetched successfully.`,
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching workspace: ${workspaceName}. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const fetchWorkspaces = async () => {
  try {
    const response = await apiClient.get("/users/");
    toast(
      CustomToast({
        title: "Success",
        description: "Workspaces fetched successfully.",
      })
    );
    return response.data.workspaces;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching workspaces. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

//connection remaining
export const removeUserFromWorkspace = async (workspaceName: string) => {
  try {
    const response = await apiClient.put("/workspaces/remove", {
      workspaceName,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `User removed from workspace ${workspaceName} successfully.`,
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error removing user from workspace: ${workspaceName}. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const inviteUser = async (
  workspaceName: string,
  userId: string,
  userEmail: string
) => {
  try {
    const response = await apiClient.post("/workspaces/invite", {
      workspaceName,
      userId,
      userEmail,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Invitation sent to ${userEmail} for workspace ${workspaceName} successfully.`,
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error inviting user: ${userEmail} to workspace: ${workspaceName}. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

export const respondInvite = async (
  userId: string,
  workspaceName: string,
  userResponse: string
) => {
  try {
    const response = await apiClient.post("/workspaces/respond", {
      userId,
      workspaceName,
      userResponse,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Response to invitation for workspace ${workspaceName} recorded successfully.`,
      })
    );
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error responding to invitation for workspace: ${workspaceName}. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};
