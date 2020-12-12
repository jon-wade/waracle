import { Handler, APIGatewayProxyEvent } from 'aws-lambda'
import { internalError, success, validationError } from '../helpers/responses'
import { getClient } from '../config/db'

const getCakeById: Handler = async (event: APIGatewayProxyEvent) => {
    const { pathParameters } = event
    if (!pathParameters) return validationError('pathParameters missing from request')

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
        return getClient().get(params, (err, data) => {
            if (err) resolve(internalError(err.message))
            if (!data.Item) resolve(validationError('no cake with the requested id'))
            else resolve(success(JSON.stringify(data.Item)))
        })
    })
};

export { getCakeById }
