import { User } from './entities/user';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
    }
}