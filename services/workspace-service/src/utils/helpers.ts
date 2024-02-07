import AWS from "aws-sdk";
import { SENDER_EMAIL } from "./constants";

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: "ncbp" });
const ses = new AWS.SES({ region: "us-east-1" });

export const sendEmail = async (to: string, workspaceName: string) => {
    const fromEmail = SENDER_EMAIL;
    const toEmail = to;
    const subject = "Invitation to join Workspace " + workspaceName + " on NCBP!";
    const body = `You have just been invited to Workspace ${workspaceName} on NCBP!

    Click here to join: https://ncbp.com/invitations
    
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