import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export type WorkspaceType = {
  id: string;
  name: string;
  description: string;
};

interface WorkspaceState {
  workspaces: WorkspaceType[];
}

const initialState: WorkspaceState = {
  workspaces: [],
};

export const fetchWorkspaces = createAsyncThunk(
  "workspaces/fetchWorkspaces",
  async () => {
    //const response = await fetchWorkspacesFromDatabase();
    //return response.data;
  }
);

export const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<WorkspaceType>) => {
      state.workspaces.push(action.payload);
    },
    removeWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter(
        (workspace) => workspace.id !== action.payload
      );
    },
    updateWorkspace: (state, action: PayloadAction<WorkspaceType>) => {
      const index = state.workspaces.findIndex(
        (workspace) => workspace.id === action.payload.id
      );
      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      // state.workspaces = action.payload;
    });
  },
});

export const { addWorkspace, removeWorkspace, updateWorkspace } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
