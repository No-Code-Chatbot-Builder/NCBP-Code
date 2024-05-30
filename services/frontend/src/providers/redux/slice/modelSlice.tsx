import { ModelType } from "@/lib/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelState {
  models: ModelType[];
  isModelLoading: boolean;
}

const initialState: ModelState = {
  models: [
    {
      modelId: "dummy-model-001",
      modelName: "Llama 3",
      baseModel: "base-model-1",
      batchSize: 32,
      createdAt: "2023-01-01T00:00:00Z",
      createdBy: "admin",
      deleted: "false",
      epochs: 10,
      jobId: "job-123",
      learningRate: 0.001,
      purpose: "Testing",
      status: "Completed",
      trainingFileId: "file-321",
    },
    {
      modelId: "dummy-model-002",
      modelName: "Llama 2",
      baseModel: "base-model-1",
      batchSize: 64,
      createdAt: "2023-02-10T00:00:00Z",
      createdBy: "admin",
      deleted: "false",
      epochs: 20,
      jobId: "job-123",
      learningRate: 0.03,
      purpose: "Testing",
      status: "Completed",
      trainingFileId: "file-321",
    },
  ],
  isModelLoading: false,
};

export const modelSlice = createSlice({
  name: "finetunedModels",
  initialState,
  reducers: {
    addModel: (state, action: PayloadAction<ModelType>) => {
      state.models.push(action.payload);
    },
    setModels: (state, action: PayloadAction<ModelType[]>) => {
      state.models = action.payload;
    },
    removeModel: (state, action: PayloadAction<string>) => {
      state.models = state.models.filter(
        (model) => model.modelId !== action.payload
      );
    },
    updateModel: (
      state,
      action: PayloadAction<{ modelId: string; status: string }>
    ) => {
      const index = state.models.findIndex(
        (model) => model.modelId === action.payload.modelId
      );
      if (index !== -1) {
        state.models[index].status = action.payload.status;
      }
    },
    setIsModelLoading: (state, action: PayloadAction<boolean>) => {
      state.isModelLoading = action.payload;
    },
  },
});

export const {
  addModel,
  removeModel,
  setIsModelLoading,
  setModels,
  updateModel,
} = modelSlice.actions;

export default modelSlice.reducer;
