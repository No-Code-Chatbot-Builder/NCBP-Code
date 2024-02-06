import { IWorkspace, IWorkspaceUser } from "../interfaces/workspace.interface"

class Workspace implements IWorkspace {
    id: string
    name: string
    admin: WorkspaceUser[]
    website?: string = ""
    description?: string = ""
    
    constructor({ id, name, admin, description, website }: IWorkspace) {
        this.id = id
        this.name = name
        this.admin = this.admins(admin)
        this.description = description
        this.website = website
    }

    key() {
        return {
            'PK': `USER#${this.admin[0].id}`,
            'SK': `WORKSPACE#${this.name}`
        }
    }

    gsiInverseKey() {
        return {
            'PK': `WORKSPACE#${this.name}`,
            'SK': `USER#${this.admin[0].id}`
        }
    }

    toItem() {
        return {
            ...this.key(),
            id: this.id,
            name: this.name,
            admin: this.admin,
            website: this.website,
            description: this.description
        }
    }

    admins(admin: IWorkspaceUser[]) {
        return admin.map(admin => new WorkspaceUser(admin))
    }
    
    static fromItem(item: IWorkspace) {
        return new Workspace({
            id: item.id,
            name: item.name,
            admin: item.admin,
            description: item.description,
            website: item.website
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