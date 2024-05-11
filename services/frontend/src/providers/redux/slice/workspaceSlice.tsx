import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export type WorkspaceType = {
  name: string;
  role: string;
};

interface WorkspaceState {
  workspaces: WorkspaceType[];
  isWorkspaceLoading: boolean;
  selectedWorkspace: WorkspaceType | null;
  currentWorkspaceName: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  selectedWorkspace: null,
  currentWorkspaceName: null,
  isWorkspaceLoading: false,
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
    setIsWorkspaceLoading: (state, action: PayloadAction<boolean>) => {
      state.isWorkspaceLoading = action.payload;
    },
    setSelectedWorkspace: (
      state,
      action: PayloadAction<WorkspaceType | null>
    ) => {
      state.selectedWorkspace = action.payload;
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
  setIsWorkspaceLoading,
  setSelectedWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
