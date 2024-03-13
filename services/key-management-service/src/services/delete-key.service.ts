import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../utils/db";
import { DeleteKeyRequest } from "../dtos/request.dto";

export const deleteKeyHandler = async (input: DeleteKeyRequest) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Key deleted successfully' }),
      };
//   const params = {
//     TableName: 'Keys',
//     Key: {
//       clientId: input.clientId,
//       userId: input.userId,
//     },
//   };

//   try {
//     await dynamoDB.send(new DeleteCommand(params));
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'Key deleted successfully' }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal server error' }),
//     };
//   }
};
