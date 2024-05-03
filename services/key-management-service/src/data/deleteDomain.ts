import { dynamoDB } from '../utils/db';
import { HttpStatusCode } from '../utils/constants';
import { Domain } from '../entities/domain';

export const deleteDomain = async (domain: Domain) => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    Key: domain.key(),
  };
  

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      return {
        error: 'Domain Record not found',
        statusCode: HttpStatusCode.NOT_FOUND,
      };
    }

    const domainIndex = result.Item.allowedDomains.indexOf(domain.allowedDomains[0]);
    if (domainIndex === -1) {
      return {
        error: 'Provided Domain does not exist in the record',
        statusCode: HttpStatusCode.NOT_FOUND,
      };
    }

    const paramsUpdate = {
        TableName: process.env.TABLE_NAME as string,
        Key: domain.key(),
        UpdateExpression: `REMOVE allowedDomains[${domainIndex}] SET updatedAt = :updatedAt`,
        ExpressionAttributeValues: {
          ':updatedAt': domain.updatedAt,
        },
        ReturnValues: 'ALL_NEW',
      };

    await dynamoDB.update(paramsUpdate).promise();

    return {
      domain,
      statusCode: HttpStatusCode.NO_CONTENT,
    };
  } catch (error) {
    console.log('Error removing domain');
    console.log(error);
    const errorMessage = 'Could not remove domain';
    const statusCode = HttpStatusCode.BAD_REQUEST;

    return {
      error: errorMessage,
      statusCode,
    };
  }
};
