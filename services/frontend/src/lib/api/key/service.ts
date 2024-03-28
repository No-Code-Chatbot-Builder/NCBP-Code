import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";

export const createKey = async (accessMode: string) => {
  try {
    const response = await apiClient.post("/keys/", { accessMode });
    toast(
      CustomToast({
        title: "Success",
        description: "Key created successfully.",
      })
    );
  } catch (error) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: "Error creating key.",
      })
    );
  }
};

export const deleteKey = async (clientId: string) => {
  try {
    const response = await apiClient.delete(`/keys/${clientId}`);
    toast(
      CustomToast({
        title: "Success",
        description: "Key deleted successfully.",
      })
    );
  } catch (error) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: "Error deleting key.",
      })
    );
  }
};

export const getKeys = async () => {
  try {
    const response = await apiClient.get("/keys/");
    toast(
      CustomToast({
        title: "Success",
        description: "Keys fetched successfully.",
      })
    );
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
