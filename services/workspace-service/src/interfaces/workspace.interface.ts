interface IWorkspace {
    name: string;
    owner: IWorkspaceUser; // owner
    members: number;
    createdAt: string;
    updatedAt: string;
    website?: string; // optional
    description?: string; // optional
}

interface IMembership {
    workspaceName: string;
    userId: string;
    userEmail: string;
    role: Role;
    createdAt: string;
}

enum Role {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member',
    PENDING = 'pending'
}

interface IWorkspaceUser {
    id: string;
    email: string;
}

export { IWorkspace, IWorkspaceUser, IMembership, Role};