import { CreateKeyRequest } from '../dtos/request.dto';

export const createKeyHandler = async (input: CreateKeyRequest) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Key created successfully' }),
  };
};
