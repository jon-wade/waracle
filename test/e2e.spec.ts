import * as request from 'superagent'
import { expect } from 'chai'

describe('e2e POST /cakes', function () {
    this.timeout(6000)
    let now: number
    before(function () {
        now = Date.now()
    })

    it('should successfully create a new cake', function (done) {
        request
            .post(
                'https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes'
            )
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .send({
                name: `test-cake-${now}`,
                comment: 'testcomment',
                imageUrl: 'http://testurl',
                yumFactor: 5,
                id: now
            })
            .then((res) => {
                expect(res.status).to.equal(201)
                expect(res.body).to.equal('ok')
                done()
            })
    })

    it('should fail to create a cake without a valid id', function (done) {
        request
            .post(
                'https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes'
            )
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .send({
                name: `test-cake-${now}`,
                comment: 'testcomment',
                imageUrl: 'http://testurl',
                yumFactor: 5,
                id: 'foo'
            })
            .catch((err) => {
                expect(err.response.body).to.equal('id must be a number')
                done()
            })
    })

    it('should fail to create a cake with the same name but a different id', function (done) {
        request
            .post(
                'https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes'
            )
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .send({
                name: `test-cake-${now}`,
                comment: 'testcomment',
                imageUrl: 'http://testurl',
                yumFactor: 5,
                id: now+1000
            })
            .catch((err) => {
                expect(err.response.body).to.equal('a cake with this name already exists')
                done()
            })
    })

    it('should fail to create a cake with a duplicate id', function (done) {
        request
            .post(
                'https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes'
            )
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .send({
                name: `test-cake-${now+1000}`,
                comment: 'testcomment',
                imageUrl: 'http://testurl',
                yumFactor: 5,
                id: now
            })
            .catch((err) => {
                expect(err.status).to.equal(400)
                expect(err.response.body).to.equal('record already exists')
                done()
            })
    })

    it('should fail to create a cake with a comment that is too short', function (done) {
        const now = Date.now()
        request
            .post(
                'https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes'
            )
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .send({
                name: `test-cake-${now}`,
                comment: 'test',
                imageUrl: 'http://testurl',
                yumFactor: 5,
                id: now
            })
            .catch((err) => {
                expect(err.status).to.equal(400)
                expect(err.response.body).to.equal('comment must be between 5 and 200 characters')
                done()
            })
    })

    it('should fail to create a cake with a yumFactor greater than 5', function (done) {
        const now = Date.now()
        request
            .post(
                'https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes'
            )
            .set('Accept', '*/*')
            .set('Content-Type', 'application/json')
            .send({
                name: `test-cake-${now}`,
                comment: 'test',
                imageUrl: 'http://testurl',
                yumFactor: 6,
                id: now
            })
            .catch((err) => {
                expect(err.status).to.equal(400)
                expect(err.response.body).to.equal('yumFactor must be between 1 and 5')
                done()
            })
    })
})
