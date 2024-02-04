interface Workspace {
    id: string;
    name: string;
    admin: WorkspaceUser[]; // an array of admin users
    website?: string; // optional
    description?: string; // optional
}

interface WorkspaceUser {
    id: string;
    email: string;
}

export { Workspace, WorkspaceUser };