import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export type WorkspaceType = {
  name: string;
  role: string;
};

interface WorkspaceState {
  workspaces: WorkspaceType[];
  currentWorkspaceName: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspaceName: null,
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
    setWorkspaces: (state, action: PayloadAction<WorkspaceType[]>) => {
      state.workspaces = action.payload;
    },
    removeWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter(
        (workspace) => workspace.name !== action.payload
      );
    },
    updateWorkspace: (state, action: PayloadAction<WorkspaceType>) => {
      const index = state.workspaces.findIndex(
        (workspace) => workspace.name === action.payload.name
      );
      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }
    },
    setCurrentWorkspace: (state, action: PayloadAction<string | null>) => {
      state.currentWorkspaceName = action.payload;
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspaceName = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      // state.workspaces = action.payload;
    });
  },
});

export const {
  addWorkspace,
  setWorkspaces,
  removeWorkspace,
  updateWorkspace,
  setCurrentWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
