import AWS from "aws-sdk";
import { SENDER_EMAIL } from "./constants";

// AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: "ncbp" });
const ses = new AWS.SES({ region: "us-east-1" });

export const sendEmail = async (to: string, workspaceName: string) => {
    const fromEmail = SENDER_EMAIL;
    const toEmail = to;
    const subject = "Invitation to join Workspace " + workspaceName + " on NCBP!";
    const body = `You have just been invited to Workspace ${workspaceName} on NCBP!

    Click here to join: http://localhost:3000/invitations
    
    Let us know if you have any questions as you explore your customized recommendations. We're always happy to help!
    
    Enjoy! The NCBP Team
    `;

    const sesParams = {
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Text: { Data: body },
        },
        Subject: { Data: subject },
      },
      Source: fromEmail,
    };

    // send email
    await ses.sendEmail(sesParams).promise();
}

export const setEnviromentVariables = () => {
  try {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error('SECRET environment variable is not provided.');
    }

    const secretJson = JSON.parse(secret);
    const requiredKeys = ['TABLE_NAME', 'PORT', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_DEFAULT_REGION', 'COGNITO_USER_POOL_ID', 'COGNITO_CLIENT_ID'];

    requiredKeys.forEach(key => {
      if (!secretJson[key]) {
        throw new Error(`Required key not found in secret: ${key}`);
      }
      process.env[key] = secretJson[key];
    });
  
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit the application if secrets can't be loaded.
  }
}
