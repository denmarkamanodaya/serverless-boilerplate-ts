import { DynamoDBClient, AttributeValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

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
