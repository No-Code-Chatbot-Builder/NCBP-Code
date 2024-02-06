interface IWorkspace {
    id: string;
    name: string;
    admin: IWorkspaceUser[]; // an array of admin users
    website?: string; // optional
    description?: string; // optional
}

interface IWorkspaceUser {
    id: string;
    email: string;
}

export { IWorkspace, IWorkspaceUser };