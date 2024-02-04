interface CreateWorkspaceRequest {
    name: string;
    ownerId: string;
    ownerEmail: string;
    website?: string;
    description?: string;
}

export { CreateWorkspaceRequest };