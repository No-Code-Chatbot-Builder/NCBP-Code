import { AddDataBucketType, DataBucketType, DatasetType, DeleteDataBucketType } from "@/lib/constants";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DatasetState {
  datasets: DatasetType[];
  isDatasetLoading: boolean;
  isDatasetFilesEmpty: boolean;
}

const initialState: DatasetState = {
  datasets: [],
  isDatasetLoading: true,
  isDatasetFilesEmpty: false,
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
    addFile: (state, action: PayloadAction<AddDataBucketType>) => {
      const index = state.datasets.findIndex(
        (dataset) => dataset.id === action.payload.datasetId
      );
      if (index !== -1) {
        state.datasets[index].data.push(action.payload.data as DataBucketType);
      }
      console.log(state.datasets[index].data);
    },
    removeFile: (state, action: PayloadAction<DeleteDataBucketType>) => {
      const index = state.datasets.findIndex(
        (dataset) => dataset.id === action.payload.datasetId
      );
      if (index !== -1) {
        state.datasets[index].data = state.datasets[index].data.filter(
          (item) => item.id !== action.payload.dataId
        );
      }
    },
    setFiles: (state, action: PayloadAction<DatasetType>) => {
      const index = state.datasets.findIndex(
        (dataset) => dataset.id === action.payload.id
      );
      if (index !== -1) {
        state.datasets[index] = action.payload;
      }
    },
    updateDataset: (state, action: PayloadAction<DatasetType>) => {
      const index = state.datasets.findIndex(
        (dataset) => dataset.id === action.payload.id
      );
      if (index !== -1) {
        state.datasets[index].name = action.payload.name;
        state.datasets[index].description = action.payload.description;
      }
    },
    setIsDatasetLoading: (state, action: PayloadAction<boolean>) => {
      state.isDatasetLoading = action.payload;
    },
    setIsDatasetFilesEmpty: (state, action: PayloadAction<boolean>) => {
      state.isDatasetFilesEmpty = action.payload;
    },
  },
});

export const {
  addDataset,
  setDatasets,
  addFile,
  removeFile,
  removeDataset,
  updateDataset,
  setIsDatasetLoading,
  setIsDatasetFilesEmpty,
  setFiles,
} = datasetSlice.actions;

export const getDatasetById = createSelector(
  [
    (state: { datasets: DatasetState }) => state.datasets.datasets,
    (state, datasetId: string) => datasetId,
  ],
  (datasets, datasetId) => datasets.find((dataset) => dataset.id === datasetId)
);

export default datasetSlice.reducer;
