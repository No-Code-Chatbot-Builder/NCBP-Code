import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";

//create workspace
export const createWorkspace = async (
  workspaceName: string,
  description: string
) => {
  try {
    const response = await apiClient.post("/workspaces/", {
      name: workspaceName,
      description: description,
    });
    toast(
      CustomToast({
        title: "Workspace created",
        description: `Workspace ${workspaceName} created successfully.`,
      })
    );
    return response.data;
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

//edit workspace
export const editWorkspace = async (
  workspaceName: string,
  description: string,
  members: number,
  createdAt: string
) => {
  try {
    const response = await apiClient.put("/workspaces/", {
      members: members,
      createdAt: createdAt,
      website: "",
      description: description,
      workspaceName: workspaceName,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Workspace ${workspaceName} updated successfully.`,
      })
    );
    return response.data;
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

//delete workspace
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

//fetch workspace by name
export const fetchWorkspace = async (workspaceName: string) => {
  try {
    const response = await apiClient.get(`/workspaces/${workspaceName}`, {
    });
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

//fetch all workspaces
export const fetchWorkspaces = async () => {
  try {
    const response = await apiClient.get("/users/");

    return response.data.workspaces;
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchWorkspaceUsers = async (workspaceName: string) => {
  try {
    const response = await apiClient.get(`workspaces/users/${workspaceName}`);
    toast(
      CustomToast({
        title: "Success",
        description: "Workspace User fetched successfully",
      })
    );
    return response.data;
  } catch (error: any) {
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching workspace: ${workspaceName} users. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

///remove user from workspace
export const removeUserFromWorkspace = async (
  userId: string,
  workspaceName: string,
  userEmail: string
) => {
  try {
    const response = await apiClient.put("/workspaces/remove", {
      userId,
      workspaceName,
      userEmail,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `User removed from workspace ${workspaceName} successfully.`,
      })
    );
    return response.data;
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

export const getUserByEmail = async (email: string) => {
  try {
    console.log(email);
    const response = await apiClient.get("/users/", {
      params: { email },
    });
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

//get all invites
export const getPendingInvites = async () => {
  try {
    const response = await apiClient.get("/workspaces/invites");

    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};

//invite user to workspace
export const inviteUser = async (workspaceName: string, userEmail: string) => {
  try {
    const response = await apiClient.post("/workspaces/invite", {
      workspaceName,
      userEmail,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Invitation sent to ${userEmail} for workspace ${workspaceName} successfully.`,
      })
    );
    return response.data;
  } catch (error: any) {
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

//respond to invite
export const respondInvite = async (
  workspaceName: string,
  response: "accepted" | "rejected"
) => {
  try {
    const res = await apiClient.post("/workspaces/respond", {
      workspaceName,
      response,
    });
    toast(
      CustomToast({
        title: "Success",
        description: `Response to invitation for workspace ${workspaceName} recorded successfully.`,
      })
    );
    return res.data;
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
