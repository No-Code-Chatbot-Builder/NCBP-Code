import { dynamoDB } from '../utils/db';
import { HttpStatusCode } from '../utils/constants';
import { Domain } from '../entities/domain';

export const addDomain = async (domain: Domain) => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    Key: domain.key(),
  };
  const paramsUpdate = {
    TableName: process.env.TABLE_NAME as string,
    Key: domain.key(),
    UpdateExpression: 'SET allowedDomains = list_append(allowedDomains, :domain), updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':domain': domain.allowedDomains,
      ':updatedAt': domain.updatedAt,
    },
    ReturnValues: 'ALL_NEW',
  };

  const paramsPut = {
    TableName: process.env.TABLE_NAME as string,
    Item: domain.toItem(),
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (result.Item) {
      await dynamoDB.update(paramsUpdate).promise();
    } else {
      await dynamoDB.put(paramsPut).promise();
    }

    return {
      domain,
      statusCode: HttpStatusCode.CREATED,
    };
  } catch (error) {
    console.log('Error adding domain');
    console.log(error);
    const errorMessage = 'Could not add domain';
    const statusCode = HttpStatusCode.BAD_REQUEST;

    return {
      error: errorMessage,
      statusCode,
    };
  }
};
