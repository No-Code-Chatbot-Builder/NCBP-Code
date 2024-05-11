
import { IMembership } from "../dtos/workspace.dto";
import { dynamoDB } from "../utils/db";
import { HttpStatusCode } from "../utils/constants";
import { Membership } from "../entities/membership";

export const getWorkspaceUsers = async (membership: Membership) => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': membership.key().PK,
      ':sk': membership.key().SK.split('#')[0],
    },
  };

  console.log('params', params);
  try {
    const result = await dynamoDB.query(params).promise();

    return {
        membership: result.Items?.map((item) => Membership.fromItem(item as IMembership)),
        statusCode: HttpStatusCode.OK,
      };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      error: 'Could not get workspace users.',
    };
  }
};
