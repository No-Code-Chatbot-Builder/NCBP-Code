interface CreateKeyRequest {
    accessMode: AccessMode;
    userId: string;
}

interface DeleteKeyRequest {
    clientId: string;
    userId: string;
}

interface GetKeysRequest {
    userId: string;
}

enum AccessMode {
    READ = 'READ',
    WRITE = 'WRITE',
}

export { CreateKeyRequest, DeleteKeyRequest, GetKeysRequest, AccessMode };