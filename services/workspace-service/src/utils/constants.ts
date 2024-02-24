import { Role } from "../dtos/workspace.dto"

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

enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503
}

export { HttpStatusCode }
export const SENDER_EMAIL = 'shariqanwar59@gmail.com'
export const DEFAULT_USER = defaultUser
export const DEFAULT_WORKSPACE = defaultWorksapce
export const DEFAULT_MEMBERSHIP = defaultMembership