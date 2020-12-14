import * as dc from '../config/db'
import { Handler } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import QueryInput = DocumentClient.QueryInput
import { internalError } from '../helpers/responses'

const getCakes: Handler = async () => {
    const params: QueryInput = {
        TableName: 'data',
        IndexName: `GSI-sk`,
        KeyConditionExpression: '#hashKey = :hashKey',
        ExpressionAttributeNames: {
            '#hashKey': 'sk'
        },
        ExpressionAttributeValues: {
            ':hashKey': `CAKE`
        }
    }

    const db = dc.getClient()
    return new Promise((resolve) => {
        return db.query(params, (err, data) => {
            if (err) return resolve(internalError(err.message))
            if (!data.Items)
                return resolve(internalError('no data returned from db'))
            else return resolve({
                statusCode: 200,
                body: JSON.stringify(data.Items),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            })
        })
    })
}

export { getCakes }
