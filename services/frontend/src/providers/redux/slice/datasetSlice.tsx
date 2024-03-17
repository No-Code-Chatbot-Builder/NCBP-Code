import { DatasetType } from "@/lib/constants";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DatasetState {
  datasets: DatasetType[];
}

const initialState: DatasetState = {
  datasets: [
    {
      id: "1",
      name: "Ibrahim's Dataset",
      description: "Contains Ibrahim's Essential Data",
    },
    {
      id: "2",
      name: "Hussain's Dataset",
      description: "Contains Hussain's Essential Data",
    },
  ],
};

export const datasetSlice = createSlice({
  name: "datasets",
  initialState,
  reducers: {
    addDataset: (state, action: PayloadAction<DatasetType>) => {
      state.datasets.push(action.payload);
    },
    removeDataset: (state, action: PayloadAction<string>) => {
      state.datasets = state.datasets.filter(
        (dataset) => dataset.id !== action.payload
      );
    },
    updateDataset: (state, action: PayloadAction<DatasetType>) => {
      const index = state.datasets.findIndex(
        (dataset) => dataset.id === action.payload.id
      );
      if (index !== -1) {
        state.datasets[index] = action.payload;
      }
    },
  },
});

export const { addDataset, removeDataset, updateDataset } =
  datasetSlice.actions;

export const getDatasetById = createSelector(
  [
    (state: { datasets: DatasetState }) => state.datasets.datasets,
    (state, datasetId: string) => datasetId,
  ],
  (datasets, datasetId) => datasets.find((dataset) => dataset.id === datasetId)
);

export default datasetSlice.reducer;
