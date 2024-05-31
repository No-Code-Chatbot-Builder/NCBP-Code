import { apiClient } from "../apiService";
import { toast } from "sonner";
import CustomToast from "@/components/global/custom-toast";


export const createModel = async (
  currentWorkspaceName: string,
  datasetId: string,
  baseModel: string,
  name: string,
  lr: string,
  epochs: string,
  batch_size: string
) => {
  try {
    const response = await apiClient.post('/finetune/model/fine-tune', {
      dataset_id: datasetId,
      workspace_id: currentWorkspaceName,
      model: baseModel,
      bot_name: name,
      batch_size: batch_size,
      lr: lr,
      epochs: epochs,
      purpose : "To deploy the bot on daraz website"
    });

    toast(
      CustomToast({
        title: "Success",
        description: "Fine Tuning process started successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error creating Dataset. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

//tested
export const checkStatus = async (
  currentWorkspaceName: string,
  job_id: string
) => {
  try {
    
    const response = await apiClient.get(
      `/finetune/model/status?workspace_id=${currentWorkspaceName}&job_id=${job_id}`
    );

    toast(
      CustomToast({
        title: "Success",
        description: "Models fetched successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching Models. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

//tested
export const cancelJob = async (workspace_id:string,job_id: string) => {
  try {
    const response = await apiClient.get(`/finetune/model/cancel?workspace_id=${workspace_id}&job_id=${job_id}`);

    toast(
      CustomToast({
        title: "Success",
        description: "Fine Tuning Job cancelled successfully.",
      })
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error cancelling job. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};

//tested
export const fetchModels = async (currentWorkspaceName: string) => {
  try {
    const response = await apiClient.get(
      `/finetune/model/models?workspace_id=${currentWorkspaceName}`
    );

    toast(
      CustomToast({
        title: "Success",
        description: "Models fetched successfully.",
      })
    );

    return response.data;
  } catch (error: any) {
    console.log(error);
    toast(
      CustomToast({
        title: "Error",
        description: `Error fetching models. ${
          error.response?.data?.message || error.message
        }`,
      })
    );
  }
};
