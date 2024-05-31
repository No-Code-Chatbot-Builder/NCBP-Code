import { ModelType } from "@/lib/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelState {
  models: ModelType[];
  isModelLoading: boolean;
  filteredModels: ModelType[];
}

const initialState: ModelState = {
  models: [],
  filteredModels: [],
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
    setFilteredModels: (state, action: PayloadAction<ModelType[]>) => {
      state.filteredModels = action.payload;
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
    filterModels: (state, action: PayloadAction<string>) => {
      state.filteredModels = [];
      state.filteredModels = state.models.filter(
        (model) => model.status === action.payload
      );
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
  filterModels,
  setFilteredModels,
  updateModel,
} = modelSlice.actions;

export default modelSlice.reducer;
