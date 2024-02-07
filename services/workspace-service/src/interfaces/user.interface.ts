interface IUser {
    userId: string;
    fullName: string; 
    email: string;
    dateOfBirth: string;
    address: string;
    workspaces: { [workspaceName: string]: string };
    createdAt: string;
}



export { IUser };

