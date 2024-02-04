import { v4 as uuidv4 } from 'uuid';

import { CreateWorkspaceRequest } from '../interfaces/request.interface';
import { dynamoDB } from '../utils/db';
import { generateDbKey } from '../utils/helpers';

export const isWorkspaceNameUnique = async (userId: string): Promise<boolean> => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    Key: generateDbKey(userId),
  };

  const result = await dynamoDB.get(params).promise();
  return !result.Item;
};

export const createWorkspace = async (input: CreateWorkspaceRequest): Promise<void> => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    Item: {
      ...generateDbKey(input.ownerId, input.name),
      id: uuidv4(),
      name: input.name,
      admin: [
        {
          id: input.ownerId,
          email: input.ownerEmail,
        },
      ],
      website: input.website || '',
      description: input.description || '',
    },
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
  };

  await dynamoDB.put(params).promise();
};
