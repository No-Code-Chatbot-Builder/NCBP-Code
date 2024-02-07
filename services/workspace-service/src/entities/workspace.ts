import { IWorkspace, IWorkspaceUser } from "../interfaces/workspace.interface"

class Workspace implements IWorkspace {
    name: string
    owner: WorkspaceUser
    members: number
    website?: string = ""
    description?: string = ""
    createdAt: string;
    updatedAt: string;
    
    constructor({ name, owner, description, website, members, createdAt, updatedAt }: IWorkspace) {
        this.name = name
        this.owner = new WorkspaceUser(owner)
        this.description = description
        this.website = website
        this.members = members
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    pk() {
        return `WORKSPACE#${this.name.toLowerCase()}`
    }

    key() {
        return {
            'PK': this.pk(),
            'SK': `WORKSPACE#${this.name.toLowerCase()}`
        }
    }

    toItem() {
        return {
            ...this.key(),
            name: this.name,
            owner: this.owner,
            members: this.members.toString(),
            website: this.website,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            type: 'workspace'
        }
    }
    
    static fromItem(item: IWorkspace) {
        return new Workspace({
            name: item.name,
            owner: item.owner,
            members: item.members,
            description: item.description,
            website: item.website,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        })
    }
}

class WorkspaceUser {
    id: string
    email: string
    
    constructor({ id, email }: IWorkspaceUser) {
        this.id = id
        this.email = email
    }

    toItem() {
        return {
            'PK': `USER#${this.id}`,
            'SK': `USEREMAIL#${this.id}`
        }
    }
}

export { Workspace, WorkspaceUser }