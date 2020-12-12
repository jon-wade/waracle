import { Response } from '../types'

const validationError = (message?: string): Response => ({
  statusCode: 400,
  body: message || 'validation error',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
})

const internalError = (message?: string): Response => ({
  statusCode: 500,
  body: message || 'internal error',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
})

const success = (message?: string | null): Response => ({
  statusCode: 200,
  body: message || 'ok',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
})

const created = (message?: string | null): Response => ({
  statusCode: 201,
  body: message || 'ok',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
})

export { validationError, internalError, success, created }
