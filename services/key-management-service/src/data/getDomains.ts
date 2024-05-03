import { dynamoDB } from '../utils/db';
import { HttpStatusCode } from '../utils/constants';
import { Domain } from '../entities/domain';
import { IDomain } from '../dtos/domain.dto';

export const getDomains = async (domain: Domain) => {
  console.log(domain)
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

    console.log(result.Item as IDomain)
    return {
      domain: Domain.fromItem(result.Item as IDomain),
      statusCode: HttpStatusCode.FOUND,
    };
  } catch (error) {
    console.log('Error getting domain');
    console.log(error);
    const errorMessage = 'Could not get domain';
    const statusCode = HttpStatusCode.BAD_REQUEST;

    return {
      error: errorMessage,
      statusCode,
    };
  }
};
