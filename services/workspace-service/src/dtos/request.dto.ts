import { Response } from "./workspace.dto";

interface CreateWorkspaceRequest {
    name: string;
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

interface GetWorkspaceUsersRequest {
    workspaceName: string;
}

interface AddUserToWorkspaceRequest {
    workspaceName: string;
    userEmail: string;
}

interface RespondToWorkspaceInviteRequest {
    workspaceName: string;
    response: Response;
}

interface RemoveUserFromWorkspaceRequest {
    userId: string;
    workspaceName: string;
    userEmail: string;
}

interface UpdateWorkspaceRequest {
    members: number;
    createdAt: string;
    website?: string;
    description?: string;
    workspaceName: string;
}

interface DeleteWorkspaceRequest {
    workspaceName: string;
}

export { CreateWorkspaceRequest, CreateUserRequest, GetWorkspaceRequest, GetWorkspaceUsersRequest, AddUserToWorkspaceRequest, RemoveUserFromWorkspaceRequest, RespondToWorkspaceInviteRequest, UpdateWorkspaceRequest, DeleteWorkspaceRequest };