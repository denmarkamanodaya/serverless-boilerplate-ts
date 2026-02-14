import { DynamoDBClient, AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

export const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'LOCAL',
    secretAccessKey: 'LOCAL',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export const putItem = async (tableName: string, item: Record<string, any>) => {
  await docClient.send(
    new PutCommand({
      TableName: tableName!,
      Item: item,
    }),
  );
};

export const getItem = async (tableName: string, key: string, value: string) => {
  return await docClient.send(
    new GetCommand({
      TableName: tableName!,
      Key: { [key]: value },
    }),
  );
};

export const getAll = async (tableName: string) => {
  return await docClient.send(
    new ScanCommand({
      TableName: tableName!,
    }),
  );
};

export const updateItem = async (
  tableName: string,
  key: string,
  value: string,
  updateExpression: string,
  expressionAttributeNames: Record<string, string>,
  expressionAttributeValues: Record<string, any>,
) => {
  await docClient.send(
    new UpdateCommand({
      TableName: tableName!,
      Key: { [key]: value },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }),
  );
};

export const getFilteredItems = async (
  tableName: string,
  filterExpression: string,
  expressionAttributeNames: Record<string, string>,
  expressionAttributeValues: Record<string, any>,
) => {
  return await docClient.send(
    new ScanCommand({
      TableName: tableName!,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }),
  );
};
