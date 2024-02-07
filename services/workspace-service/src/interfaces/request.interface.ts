interface CreateWorkspaceRequest {
    name: string;
    userId: string;
    userEmail: string;
    website?: string;
    description?: string;
}

interface CreateUserRequest {
    userId: string;
    fullName: string;
    email: string;
    dateOfBirth: string;
    address: string;
}

interface GetWorkspaceRequest {
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
    userId: string;
    userEmail: string;
    members: number;
    createdAt: string;
    website?: string;
    description?: string;
    workspaceName: string;
}

interface DeleteWorkspaceRequest {
    userId: string;
    workspaceName: string;
}

export { CreateWorkspaceRequest, CreateUserRequest, GetWorkspaceRequest, AddUserToWorkspaceRequest, RemoveUserFromWorkspaceRequest, UpdateWorkspaceRequest, DeleteWorkspaceRequest };