import { Handler, APIGatewayProxyEvent } from 'aws-lambda'
import { internalError, validationError } from '../helpers/responses'
import * as dc from '../config/db'

const getCakeById: Handler = async (event: APIGatewayProxyEvent) => {
    const { pathParameters } = event
    if (!pathParameters)
        return validationError('pathParameters missing from request')

    const id = pathParameters.id
    if (!id) return validationError('no id in pathParameters')
    if (isNaN(Number(id))) return validationError('id must be a number')

    const params = {
        TableName: 'data',
        Key: {
            id: Number(id),
            sk: 'CAKE'
        }
    }

    const db = dc.getClient()
    return new Promise((resolve) => {
        return db.get(params, (err, data) => {
            if (err) return resolve(internalError(err.message))
            if (!data.Item)
                return resolve(validationError('no cake with the requested id'))
            else return resolve({
                statusCode: 200,
                body: JSON.stringify(data.Item),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            })
        })
    })
}

export { getCakeById }
