import { Handler, APIGatewayProxyEvent } from 'aws-lambda';
import { Cake } from '../types'
import {validationError, success, internalError} from '../helpers/responses'
import { getClient } from '../config/db'

const postCake: Handler = async (event: APIGatewayProxyEvent) => {
    const { body } = event
    if (!body) return validationError('body missing from request')

    let bodyObj
    try {
        bodyObj = JSON.parse(body)
    } catch (err) {
        return validationError('body is incorrectly formatted')
    }

    const { id, comment, imageUrl, name, yumFactor } = bodyObj

    if (id === undefined ||
      comment === undefined ||
      imageUrl === undefined ||
      name === undefined ||
      yumFactor === undefined
    ) return validationError('body missing mandatory parameters')

    if (typeof id !== 'number') return validationError('id must be a number')
    if (typeof yumFactor !== 'number') return validationError('yumFactor must be a number')
    if (yumFactor < 1 || yumFactor > 5) return validationError('yumFactor must be between 1 and 5')
    if (typeof comment !== 'string') return validationError('comment must be a string')
    if (comment.length < 5 || comment.length > 200) return validationError('comment must be between 5 and 200 characters')
    if (typeof imageUrl !== 'string') return validationError('imageUrl must be a string')
    if (imageUrl.length < 1) return validationError('imageUrl must have at least one character')
    if (typeof name !== 'string') return validationError('name must be a string')
    if (name.length < 1) return validationError('name must have at least one character')

    const cake: Cake = {
        id, comment, imageUrl, name, yumFactor
    }

    const now = new Date().toISOString()

    const putParams = {
        TableName: 'data',
        Item: {
        ...cake, sk: 'CAKE', createdAt: now, updatedAt: now, version: 1
        },
        ConditionExpression: 'attribute_not_exists(#name)',
        ExpressionAttributeNames: {
            '#name': 'name'
        }
    }

    return new Promise((resolve) => {
        return getClient().put(putParams, (err) => {
            if (err && err.statusCode === 400) resolve(validationError('record already exists'))
            else if (err) resolve(internalError(err.message))
            else resolve(success())
        })
    })

};

export { postCake }
