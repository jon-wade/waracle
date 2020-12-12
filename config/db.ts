import { DynamoDB } from 'aws-sdk'

const getClient = (): DynamoDB.DocumentClient => {
  return new DynamoDB.DocumentClient();
};

export { getClient }
