import { DataBucketType, DatasetType } from "@/lib/constants";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DatasetState {
  datasets: DatasetType[];
  isDatasetLoading: boolean;
}

const initialState: DatasetState = {
  datasets: [],
  isDatasetLoading: true,
};

export const datasetSlice = createSlice({
  name: "datasets",
  initialState,
  reducers: {
    addDataset: (state, action: PayloadAction<DatasetType>) => {
      state.datasets.push(action.payload);
    },
    setDatasets: (state, action: PayloadAction<DatasetType[]>) => {
      state.datasets = action.payload;
    },
    removeDataset: (state, action: PayloadAction<string>) => {
      state.datasets = state.datasets.filter(
        (dataset) => dataset.id !== action.payload
      );
    },
    addFile: (state, action: PayloadAction<DataBucketType>) => {
      const index = state.datasets.findIndex(
        (dataset) => dataset.id === action.payload.id
      );
      if (index !== -1) {
        state.datasets[index].data.push(action.payload);
      }
      console.log(state.datasets[index].data);
    },
    updateDataset: (state, action: PayloadAction<DatasetType>) => {
      console.log("fromUpdateDatasets");
      console.log(action.payload.id);
      console.log(state.datasets);
      const index = state.datasets.findIndex(
        (dataset) => dataset.id === action.payload.id
      );
      console.log(index);
      if (index !== -1) {
        state.datasets[index] = action.payload;
      }
    },
    setIsDatasetLoading: (state, action: PayloadAction<boolean>) => {
      state.isDatasetLoading = action.payload;
    },
  },
});

export const {
  addDataset,
  setDatasets,
  addFile,
  removeDataset,
  updateDataset,
  setIsDatasetLoading,
} = datasetSlice.actions;

export const getDatasetById = createSelector(
  [
    (state: { datasets: DatasetState }) => state.datasets.datasets,
    (state, datasetId: string) => datasetId,
  ],
  (datasets, datasetId) => datasets.find((dataset) => dataset.id === datasetId)
);

export default datasetSlice.reducer;
