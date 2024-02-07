import { IMembership, Role } from "../interfaces/workspace.interface"


class Membership {
    workspaceName: string
    userId: string
    userEmail: string
    role: Role
    createdAt: string

    constructor({ workspaceName, userId, userEmail, role, createdAt }: IMembership) {
        this.workspaceName = workspaceName
        this.userId = userId
        this.userEmail = userEmail
        this.role = role
        this.createdAt = createdAt
    }

    key() {
        return {
            'PK': `WORKSPACE#${this.workspaceName.toLowerCase()}`,
            'SK':`MEMBERSHIP#${this.userId}`
        }
    }

    toItem() {
        return {
            ...this.key(),
            workspaceName: this.workspaceName,
            userId: this.userId,
            userEmail: this.userEmail,
            role: this.role.toString(),
            createdAt: this.createdAt,
            type: 'membership'
        }
    }

    static fromItem(item: IMembership) {
        return new Membership({
            workspaceName: item.workspaceName,
            userId: item.userId,
            userEmail: item.userEmail,
            role: item.role,
            createdAt: item.createdAt
        })
    
    }

}


export { Membership }