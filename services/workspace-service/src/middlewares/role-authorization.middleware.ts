import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { DEFAULT_USER, HttpStatusCode } from '../utils/constants';
import { getUser } from '../data/getUser';
import { Role } from '../dtos/workspace.dto';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;

    const queryUser = new User({
        ...DEFAULT_USER,
        userId: req.headers["x-user-id"] as string,
    })

    const { error, user } = await getUser(queryUser)
    if (error) {
        return res.status(500).json({ error });
    }

    if (!user) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized - User not found' });
    }

    if (!user.workspaces.hasOwnProperty(input.workspaceName.toLowerCase())) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Unauthorized - User not part of workspace' });
    }

    const role = user.workspaces[input.workspaceName.toLowerCase()];
    if (role !== Role.ADMIN && role !== Role.OWNER) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Unauthorized - User does not have permission' });
    }

    next();
};