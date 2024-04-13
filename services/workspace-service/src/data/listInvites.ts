import { IMembership } from '../dtos/workspace.dto';
import { Membership } from '../entities/membership';
import { HttpStatusCode } from '../utils/constants';
import { dynamoDB } from '../utils/db';

export const listInvites = async (queryMembership: Membership) => {
  const paramsMembership = {
    IndexName: 'GSIInverted',
    TableName: process.env.TABLE_NAME as string,
    KeyConditionExpression: 'SK= :sk and begins_with(PK, :pk)',
    FilterExpression: '#role = :role',
    ExpressionAttributeNames: {
      '#role': 'role',
    },
    ExpressionAttributeValues: {
      ':sk': queryMembership.key().SK,
      ':pk': 'WORKSPACE#',
      ':role': queryMembership.role,
    },
  };

  try {
    const data = await dynamoDB.query(paramsMembership).promise();

    return {
      membership: data.Items?.map((item) => Membership.fromItem(item as IMembership)),
      statusCode: HttpStatusCode.OK,
    };
  } catch (error: any) {
    console.log(error);

    return {
      error: 'Could not list invites.',
      statusCode: HttpStatusCode.BAD_REQUEST,
    };
  }
};
