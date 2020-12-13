import { Handler, APIGatewayProxyEvent } from 'aws-lambda'
import { internalError, success, validationError } from '../helpers/responses'
import { getClient } from '../config/db'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const putCakeById: Handler = async (event: APIGatewayProxyEvent) => {
    const { pathParameters, body } = event
    if (!pathParameters)
        return validationError('pathParameters missing from request')
    if (!body) return validationError('body missing from request')

    const id = pathParameters.id
    if (!id) return validationError('no id in pathParameters')
    if (isNaN(Number(id))) return validationError('id must be a number')

    let bodyObj
    try {
        bodyObj = JSON.parse(body)
    } catch (err) {
        return validationError('body is incorrectly formatted')
    }

    const { comment, imageUrl, name, yumFactor } = bodyObj
    const updatePropertyArr: Array<Array<string | number>> = []

    if (comment !== undefined) {
        if (typeof comment !== 'string')
            return validationError('comment must be a string')
        if (comment.length < 5 || comment.length > 200)
            return validationError(
                'comment must be between 5 and 200 characters'
            )
        updatePropertyArr.push(['comment', comment])
    }

    if (yumFactor !== undefined) {
        if (typeof yumFactor !== 'number')
            return validationError('yumFactor must be a number')
        if (yumFactor < 1 || yumFactor > 5)
            return validationError('yumFactor must be between 1 and 5')
        updatePropertyArr.push(['yumFactor', yumFactor])
    }

    if (name !== undefined) {
        if (typeof name !== 'string')
            return validationError('name must be a string')
        if (name.length < 1)
            return validationError('name must have at least one character')
        updatePropertyArr.push(['name', name])
    }

    if (imageUrl !== undefined) {
        if (typeof imageUrl !== 'string')
            return validationError('imageUrl must be a string')
        if (imageUrl.length < 1)
            return validationError('imageUrl must have at least one character')
        updatePropertyArr.push(['imageUrl', imageUrl])
    }

    // check if a cake with the proposed name already exists in the db
    const params: DocumentClient.QueryInput = {
        TableName: 'data',
        KeyConditionExpression: '#hashKey = :hashKey and #rangeKey = :rangeKey',
        ExpressionAttributeNames: {
            '#hashKey': 'id',
            '#rangeKey': 'sk',
            '#name': 'name'
        },
        FilterExpression: '#name = :name',
        ExpressionAttributeValues: {
            ':hashKey': Number(id),
            ':rangeKey': 'CAKE',
            ':name': name
        }
    }

    let updateExpStr = 'SET #version = if_not_exists(#version, :zero) + :incr, '

    // iterate over each key in the update object
    updatePropertyArr.forEach((item) => {
        updateExpStr = `${updateExpStr} #${item[0]} = :${item[0]}, `
    })

    // finish off the updateExpression
    updateExpStr = `${updateExpStr}#updatedAt = :updatedAt`

    const expNamesObj: DocumentClient.ExpressionAttributeNameMap = {
        '#updatedAt': 'updatedAt',
        '#version': 'version'
    }

    updatePropertyArr.forEach((item) => {
        expNamesObj[`#${item[0]}`] = `${item[0]}`
    })

    const expValuesObj: DocumentClient.ExpressionAttributeValueMap = {
        ':zero': 0,
        ':incr': 1,
        ':updatedAt': new Date().toISOString()
    }

    updatePropertyArr.forEach((item) => {
        expValuesObj[`:${item[0]}`] = item[1]
    })

    const updateParams: DocumentClient.UpdateItemInput = {
        TableName: 'data',
        Key: {
            id,
            sk: 'CAKE'
        },
        UpdateExpression: updateExpStr,
        ExpressionAttributeNames: expNamesObj,
        ExpressionAttributeValues: expValuesObj
    }

    return new Promise((resolve) => {
        const db = getClient()
        db.query(params, (err, data) => {
            if (err) return resolve(internalError(err.message))
            if (data.Items && data.Items.length)
                return resolve(
                    validationError('a cake with this name already exists')
                )
            db.update(updateParams, (err) => {
                if (err) return resolve(internalError(err.message))
                return resolve(success())
            })
        })
    })
}

export { putCakeById }
