import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { DEFAULT_USER } from '../utils/constants';
import { getUser } from '../data/getUser';
import { Role } from '../interfaces/workspace.interface';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;

    const queryUser = new User({
        ...DEFAULT_USER,
        userId: input.userId,
    })

    const { error, user } = await getUser(queryUser)
    if (error) {
        return res.status(500).json({ error });
    }

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    if (!user.workspaces.hasOwnProperty(input.workspaceName.toLowerCase())) {
        return res.status(401).json({ error: 'Unauthorized - User not part of workspace' });
    }

    const role = user.workspaces[input.workspaceName.toLowerCase()];
    if (role !== Role.ADMIN && role !== Role.OWNER) {
        return res.status(401).json({ error: 'Unauthorized - User does not have permission' });
    }

    next();
};