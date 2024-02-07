import { Workspace } from "../entities/workspace"
import { dynamoDB } from "../utils/db"


export const updateWorkspace = async (workspace: Workspace) => {
    try {
        const resp = await dynamoDB.update({
            TableName: process.env.TABLE_NAME as string,
            Key: workspace.key(),
            ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
            UpdateExpression: "SET #website = :website, #description = :description, #members = :members, #updatedAt = :updatedAt",
            ExpressionAttributeNames: {
                '#website': 'website',
                '#description': 'description',
                '#members': 'members',
                '#updatedAt': 'updatedAt'
            },
            ExpressionAttributeValues: {
                ':website': workspace.website,
                ':description': workspace.description,
                ':members': workspace.members,
                ':updatedAt': workspace.updatedAt
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        return {
            workspace: Workspace.fromItem(resp.Attributes as Workspace)
        }
    } catch(error: any) {
        console.log('Error updating workspace')
        console.log(error)
        let errorMessage = 'Could not update workspace'
        // If it's a condition check violation, we'll try to indicate which condition failed.
        if (error.code === 'ConditionalCheckFailedException') {
            errorMessage = 'Workspace does not exist'
        }
        return {
            error: errorMessage
        }
    }
}

