import { Handler, APIGatewayProxyEvent } from 'aws-lambda'
import { internalError, success, validationError } from '../helpers/responses'
import { getClient } from '../config/db'

const deleteCakeById: Handler = async (event: APIGatewayProxyEvent) => {
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

    return new Promise((resolve) => {
        return getClient().delete(params, (err) => {
            if (err) resolve(internalError(err.message))
            else resolve(success())
        })
    })
}

export { deleteCakeById }
