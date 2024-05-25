import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WorkspaceType = {
  name: string;
  role: string;
};

export type CurrentWorkspaceType = {
  name: string;
  owner: {
    id: string;
    email: string;
  };
  members: number;
  createdAt: string;
  updatedAt: string;
  website?: string;
  description?: string;
};

export type WorkspaceUserType = {
  role: string;
  userEmail: string;
  userId: string;
  workspaceName: string;
};

interface WorkspaceState {
  workspaces: WorkspaceType[];
  currentWorkspaceUsers: WorkspaceUserType[];
  isWorkspaceLoading: boolean;
  currentWorkspace: CurrentWorkspaceType | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspaceUsers: [],
  currentWorkspace: null,
  isWorkspaceLoading: false,
};

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
    setWorkspaceUsers: (state, action: PayloadAction<WorkspaceUserType[]>) => {
      state.currentWorkspaceUsers = action.payload;
    },
    removeWorkspaceUser: (state, action: PayloadAction<string>) => {
      state.currentWorkspaceUsers = state.currentWorkspaceUsers.filter(
        (user) => user.userId !== action.payload
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
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
    },
    setIsWorkspaceLoading: (state, action: PayloadAction<boolean>) => {
      state.isWorkspaceLoading = action.payload;
    },
    setCurrentWorkspace: (
      state,
      action: PayloadAction<CurrentWorkspaceType | null>
    ) => {
      state.currentWorkspace = action.payload;
    },
  },
});

export const {
  addWorkspace,
  setWorkspaces,
  removeWorkspace,
  updateWorkspace,
  setCurrentWorkspace,
  setWorkspaceUsers,
  setIsWorkspaceLoading,
  removeWorkspaceUser,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
