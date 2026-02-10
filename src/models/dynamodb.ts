import { DynamoDBClient, AttributeValue, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: 'local',
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: 'LOCAL',
    secretAccessKey: 'LOCAL',
  },
});

export const putItem = async (item: Record<string, AttributeValue>) => {
  await client.send(
    new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: item,
    }),
  );
};
