import { ModelType } from "@/lib/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelState {
  models: ModelType[];
  isModelLoading: boolean;
}

const initialState: ModelState = {
  models: [],
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
    updateModel: (state, action: PayloadAction<string, string>) => {
      const index = state.models.findIndex(
        (model) => model.modelId === action.payload
      );
      if (index !== -1) {
        state.models[index].status = action.payload;
      }
    },
    setIsModelLoading: (state, action: PayloadAction<boolean>) => {
      state.isModelLoading = action.payload;
    },
  },
});

export const { addModel, removeModel, setIsModelLoading, setModels } =
  modelSlice.actions;

export default modelSlice.reducer;
