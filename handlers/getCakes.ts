import { getClient } from '../config/db'
import { Handler } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import QueryInput = DocumentClient.QueryInput
import { internalError, success } from '../helpers/responses'

const getCakes: Handler = async () => {
  const params: QueryInput = {
    TableName: 'data',
    IndexName: `GSI-sk`,
    KeyConditionExpression: '#hashKey = :hashKey',
    ExpressionAttributeNames: {
      '#hashKey': 'sk',
    },
    ExpressionAttributeValues: {
      ':hashKey': `CAKE`
    }
  }

  return new Promise((resolve) => {
    return getClient().query(params, (err, data) => {
      if (err) return resolve(internalError(err.message))
      if (!data.Items || !data.Items.length) return resolve(success('no cakes found'))
      else return resolve(success(JSON.stringify(data.Items)))
    })
  })
};

export { getCakes }
