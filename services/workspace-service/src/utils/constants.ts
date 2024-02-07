import { Role } from "../interfaces/workspace.interface"

const defaultUser = {
    username: 'default',
    email: 'default',
    fullName: 'default',
    dateOfBirth: 'default',
    address: 'default',
    createdAt: 'default',
    workspaces: {}
}

const defaultWorksapce = {
    name: 'default',
    owner: {
        id: 'default',
        email: 'default'
    },
    createdAt: 'default',
    updatedAt: 'default',
    members: 0,
    description: 'default',
    website: 'default'
}

const defaultMembership = {
    workspaceName: 'default',
    userId: 'default',
    userEmail: 'default',
    role: Role.MEMBER,
    createdAt: 'default'
}

export const SENDER_EMAIL = 'shariqanwar59@gmail.com'
export const DEFAULT_USER = defaultUser
export const DEFAULT_WORKSPACE = defaultWorksapce
export const DEFAULT_MEMBERSHIP = defaultMembership