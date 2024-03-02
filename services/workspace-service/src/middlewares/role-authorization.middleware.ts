import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { HttpStatusCode } from '../utils/constants';
import { Role } from '../dtos/workspace.dto';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const input = req.body;

    
    if (!user.workspaces.hasOwnProperty(input.workspaceName.toLowerCase())) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Unauthorized - User not part of workspace' });
    }

    const role = user.workspaces[input.workspaceName.toLowerCase()];
    if (role !== Role.ADMIN && role !== Role.OWNER) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Unauthorized - User does not have permission' });
    }

    next();
};