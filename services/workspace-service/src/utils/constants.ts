
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

export const DEFAULT_USER = defaultUser
export const DEFAULT_WORKSPACE = defaultWorksapce