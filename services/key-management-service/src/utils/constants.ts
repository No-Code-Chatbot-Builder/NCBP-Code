const defaultUser = {
    username: 'default',
    email: 'default',
    fullName: 'default',
    dateOfBirth: 'default',
    address: 'default',
    createdAt: 'default',
    workspaces: {}
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
export const DEFAULT_USER = defaultUser