import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const getNameCheckParams = (name: string): DocumentClient.QueryInput => {
    return {
        TableName: 'data',
        IndexName: `GSI-sk`,
        KeyConditionExpression: '#hashKey = :hashKey',
        FilterExpression: '#name = :name',
        ExpressionAttributeNames: {
            '#hashKey': 'sk',
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':hashKey': `CAKE`,
            ':name': name
        }
    }
}

export { getNameCheckParams }
