import { IUser } from "../dtos/user.dto"

class User implements IUser {

    userId: string
    email: string
    fullName: string
    dateOfBirth: string
    address: string
    workspaces: { [workspaceName: string]: string }
    createdAt: string
    
    
    
    constructor({ userId, email, fullName, dateOfBirth, address,createdAt,workspaces }: IUser) {
        this.userId = userId
        this.email = email
        this.fullName = fullName
        this.dateOfBirth = dateOfBirth
        this.address = address
        this.createdAt = createdAt
        this.workspaces = workspaces
    }

    pk() {
        return `USER#${this.userId}`
    }

    key() {
        return {
            'PK': this.pk(),
            'SK': `USEREMAIL#${this.email}`
        }
    }

    toItem() {
        return {
            ...this.key(),
            userId: this.userId,
            email: this.email,
            fullName: this.fullName,
            dateOfBirth: this.dateOfBirth,
            address: this.address,
            createdAt: this.createdAt,
            workspaces: this.workspaces,
            type: 'user'
        }
    }
    
    static fromItem(item: IUser) {
        return new User({
            userId: item.userId,
            email: item.email,
            fullName: item.fullName,
            dateOfBirth: item.dateOfBirth,
            address: item.address,
            createdAt: item.createdAt,
            workspaces: item.workspaces
        })
    }
}

export { User }