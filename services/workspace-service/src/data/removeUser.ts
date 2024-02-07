import { Membership } from '../entities/membership';
import { dynamoDB } from '../utils/db';

export const removeUser = async (membership: Membership) => {
    // TODO: remove from user record
  const paramsMembership = {
    TableName: process.env.TABLE_NAME as string,
    Key: membership.key(),
    ReturnValues: 'ALL_OLD',
  };

  try {
    const result = await dynamoDB.delete(paramsMembership).promise();

    return {
      membership: Membership.fromItem(result.Attributes as Membership),
    };
  } catch (error: any) {
    console.log('Error removing user from workspace');
    console.log(error);
    let errorMessage = 'Could not remove uer from workspace';
    // If it's a condition check violation, we'll try to indicate which condition failed.
    if (error.code === 'ConditionalCheckFailedException') {
      errorMessage = 'User doesnot exist in workspace';
    }
    return {
      error: errorMessage,
    };
  }
};
