import { Handler, Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';
import { Response, Cake } from '../types'

const getCakes: Handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const response: Response = {
        statusCode: 200,
        body: 'OK',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
    };
    callback(undefined, response);
};

export { getCakes }
