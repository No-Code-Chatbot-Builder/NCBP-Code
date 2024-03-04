import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type ModalData = {};

interface ModalState {
  isOpen: boolean;
  data: ModalData;
}

const initialState: ModalState = {
  isOpen: false,
  data: {},
};

export const fetchDataAndOpenModal = createAsyncThunk(
  "modal/fetchDataAndOpen",
  async (fetchData: () => Promise<any>, thunkAPI) => {
    try {
      if (fetchData) {
        const fetchedData = await fetchData();
        return fetchedData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch data");
    }
  }
);

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ data?: any }>) => {
      state.isOpen = true;
      state.data = action.payload.data || {};
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataAndOpenModal.fulfilled, (state, action) => {
        state.isOpen = true;
        state.data = action.payload;
      })
      .addCase(fetchDataAndOpenModal.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
