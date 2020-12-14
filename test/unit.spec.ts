import { createSandbox, SinonFakeTimers, SinonStub } from 'sinon'
import { Callback, Context } from 'aws-lambda'
import { expect } from 'chai'

const sandbox = createSandbox()
import * as dc from '../config/db'
import { postCake } from '../handlers/postCake'

describe('unit POST /cakes', function () {
    const mockContext: Context = {
        callbackWaitsForEmptyEventLoop: true,
        functionVersion: '$LATEST',
        functionName: 'waracle-test-postCake',
        memoryLimitInMB: '1024',
        logGroupName: '/aws/lambda/waracle-test-postCake',
        logStreamName: '2020/12/13/[$LATEST]3233698d97644f12bccc433e30e25892',
        invokedFunctionArn:
            'arn:aws:lambda:eu-west-1:194844862910:function:waracle-test-postCake',
        awsRequestId: '3204e197-0ed2-421a-aede-980f5dfeacf6',
        getRemainingTimeInMillis: (): number => 10,
        succeed: () => true,
        fail: () => false,
        done: () => true
    }

    const mockCallback: Callback = () => true

    let getClientStub: SinonStub,
        putStub: SinonStub,
        queryStub: SinonStub,
        clock: SinonFakeTimers
    before(function () {
        clock = sandbox.useFakeTimers()
        putStub = sandbox.stub()
        queryStub = sandbox.stub()
        getClientStub = sandbox.stub(dc, 'getClient').returns({
            put: putStub,
            query: queryStub,
            batchGet: sandbox.stub(),
            createSet: sandbox.stub(),
            delete: sandbox.stub(),
            get: sandbox.stub(),
            scan: sandbox.stub(),
            batchWrite: sandbox.stub(),
            transactWrite: sandbox.stub(),
            update: sandbox.stub(),
            transactGet: sandbox.stub()
        })
    })

    afterEach(function () {
        putStub.reset()
        queryStub.reset()
    })

    after(function () {
        sandbox.restore()
        clock.restore()
    })

    it('should return 201, ok on success', async function () {
        const mockEvent = {
            body: JSON.stringify({
                id: 1,
                name: 'test-cake-1',
                comment: 'yummy',
                imageUrl: 'image1',
                yumFactor: 5
            })
        }

        queryStub.callsFake((params, cb) =>
            cb(null, {
                Items: []
            })
        )

        putStub.callsFake((params, cb) => cb(null))

        const res = await postCake(mockEvent, mockContext, mockCallback)
        expect(res.statusCode).to.equal(201)
        expect(JSON.parse(res.body)).to.equal('ok')
        expect(res.headers).to.deep.equal({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        })
        expect(queryStub.lastCall.firstArg).to.deep.equal({
            TableName: 'data',
            IndexName: 'GSI-sk',
            KeyConditionExpression: '#hashKey = :hashKey',
            FilterExpression: '#name = :name',
            ExpressionAttributeNames: { '#hashKey': 'sk', '#name': 'name' },
            ExpressionAttributeValues: {
                ':hashKey': 'CAKE',
                ':name': 'test-cake-1'
            }
        })
        expect(putStub.lastCall.firstArg).to.deep.equal({
            TableName: 'data',
            Item: {
                id: 1,
                comment: 'yummy',
                imageUrl: 'image1',
                name: 'test-cake-1',
                yumFactor: 5,
                sk: 'CAKE',
                createdAt: '1970-01-01T00:00:00.000Z',
                updatedAt: '1970-01-01T00:00:00.000Z',
                version: 1
            },
            ConditionExpression: 'attribute_not_exists(id)'
        })
    })

    it('should return 400 on a duplicate name', async function () {
        const mockEvent = {
            body: JSON.stringify({
                id: 1,
                name: 'test-cake-1',
                comment: 'yummy',
                imageUrl: 'image1',
                yumFactor: 5
            })
        }

        queryStub.callsFake((params, cb) =>
            cb(null, {
                Items: [
                    {
                        id: 2,
                        name: 'test-cake-1'
                    }
                ]
            })
        )

        const res = await postCake(mockEvent, mockContext, mockCallback)
        expect(res.statusCode).to.equal(400)
        expect(JSON.parse(res.body)).to.equal(
            'a cake with this name already exists'
        )
        expect(res.headers).to.deep.equal({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        })
        expect(queryStub.lastCall.firstArg).to.deep.equal({
            TableName: 'data',
            IndexName: 'GSI-sk',
            KeyConditionExpression: '#hashKey = :hashKey',
            FilterExpression: '#name = :name',
            ExpressionAttributeNames: { '#hashKey': 'sk', '#name': 'name' },
            ExpressionAttributeValues: {
                ':hashKey': 'CAKE',
                ':name': 'test-cake-1'
            }
        })
    })

    it('should return 500 on a multiple duplicated name', async function () {
        const mockEvent = {
            body: JSON.stringify({
                id: 1,
                name: 'test-cake-1',
                comment: 'yummy',
                imageUrl: 'image1',
                yumFactor: 5
            })
        }

        queryStub.callsFake((params, cb) =>
            cb(null, {
                Items: [
                    {
                        id: 2,
                        name: 'test-cake-1'
                    },
                    {
                        id: 3,
                        name: 'test-cake-1'
                    }
                ]
            })
        )

        const res = await postCake(mockEvent, mockContext, mockCallback)
        expect(res.statusCode).to.equal(500)
        expect(JSON.parse(res.body)).to.equal(
            'duplicate named cakes found in db'
        )
        expect(res.headers).to.deep.equal({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        })
        expect(queryStub.lastCall.firstArg).to.deep.equal({
            TableName: 'data',
            IndexName: 'GSI-sk',
            KeyConditionExpression: '#hashKey = :hashKey',
            FilterExpression: '#name = :name',
            ExpressionAttributeNames: { '#hashKey': 'sk', '#name': 'name' },
            ExpressionAttributeValues: {
                ':hashKey': 'CAKE',
                ':name': 'test-cake-1'
            }
        })
    })

    it('should return 400 on trying to create an existing id with different name', async function () {
        const mockEvent = {
            body: JSON.stringify({
                id: 1,
                name: 'test-cake-100',
                comment: 'yummy',
                imageUrl: 'image1',
                yumFactor: 5
            })
        }

        queryStub.callsFake((params, cb) =>
            cb(null, {
                Items: []
            })
        )

        putStub.callsFake((params, cb) =>
            cb({
                statusCode: 400
            })
        )

        const res = await postCake(mockEvent, mockContext, mockCallback)
        expect(res.statusCode).to.equal(400)
        expect(JSON.parse(res.body)).to.equal('record already exists')
        expect(res.headers).to.deep.equal({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        })
        expect(queryStub.lastCall.firstArg).to.deep.equal({
            TableName: 'data',
            IndexName: 'GSI-sk',
            KeyConditionExpression: '#hashKey = :hashKey',
            FilterExpression: '#name = :name',
            ExpressionAttributeNames: { '#hashKey': 'sk', '#name': 'name' },
            ExpressionAttributeValues: {
                ':hashKey': 'CAKE',
                ':name': 'test-cake-100'
            }
        })
        expect(putStub.lastCall.firstArg).to.deep.equal({
            TableName: 'data',
            Item: {
                id: 1,
                comment: 'yummy',
                imageUrl: 'image1',
                name: 'test-cake-100',
                yumFactor: 5,
                sk: 'CAKE',
                createdAt: '1970-01-01T00:00:00.000Z',
                updatedAt: '1970-01-01T00:00:00.000Z',
                version: 1
            },
            ConditionExpression: 'attribute_not_exists(id)'
        })
    })
})
