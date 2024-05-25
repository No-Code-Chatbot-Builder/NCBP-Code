import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";

export const addDomain = async (workspaceId: string, botId: string, domain: string) => {
  console.log(workspaceId,botId,domain)
  try {
    const response = await apiClient.post("/domains/", { workspaceId: workspaceId, botId: botId, domain: domain });
    toast(
      CustomToast({
        title: "Success",
        description: "Domain added successfully.",
      })
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: "Error adding domain.",
      })
    );
  }
};

export const deleteDomain = async (workspaceId: string, botId: string, domain: string) => {
  try {
    const response = await apiClient.delete("/domains/", {
      data: { workspaceId: workspaceId, botId: botId, domain: domain }
    });
    toast(
      CustomToast({
        title: "Success",
        description: "Domain deleted successfully.",
      })
    );
  } catch (error) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: "Error deleting domain.",
      })
    );
  }
};

export const getDomainsByAssistant = async (workspaceId : string,botId : string) => {
  try {
    const response = await apiClient.get(`/domains/?workspaceId=${workspaceId}&botId=${botId}`);
    toast(
      CustomToast({
        title: "Success",
        description: "Domains fetched successfully.",
      })
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: "Error fetching keys.",
      })
    );
  }
};
