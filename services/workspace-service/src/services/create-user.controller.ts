import { CreateUserRequest } from '../dtos/request.dto';
import { createUser } from '../data/createUser';
import { User } from '../entities/user';

export const createUserHandler = async (input: CreateUserRequest) => {
  const user = new User({
    id: input.userId,
    email: input.email,
    fullName: input.fullName,
    createdAt: new Date().toISOString(),
    dateOfBirth: input.dateOfBirth,
    address: input.address,
    workspaces: {
        "myworkspace": "member",
        "myworkspace123": "owner"
    },
  });

  const { error } = await createUser(user);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ user });

  return {
    statusCode,
    body,
  };
};
