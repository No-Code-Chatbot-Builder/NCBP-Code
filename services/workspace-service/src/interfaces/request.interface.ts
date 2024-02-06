interface CreateWorkspaceRequest {
    name: string;
    userId: string;
    userEmail: string;
    website?: string;
    description?: string;
}

interface GetWorkspaceRequest {
    userId: string;
    workspaceName: string;
}

interface AddUserToWorkspaceRequest {
    userId: string;
    workspaceName: string;
    userEmail: string;
}

interface RemoveUserFromWorkspaceRequest {
    userId: string;
    workspaceName: string;
    userEmail: string;
}

interface UpdateWorkspaceRequest {
    website?: string;
    description?: string;
    userId: string;
    workspaceName: string;
}

interface DeleteWorkspaceRequest {
    userId: string;
    workspaceName: string;
}

export { CreateWorkspaceRequest, GetWorkspaceRequest, AddUserToWorkspaceRequest, RemoveUserFromWorkspaceRequest, UpdateWorkspaceRequest, DeleteWorkspaceRequest };