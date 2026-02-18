import { DynamoDBService } from '../services/dynamodb.service';

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Firetron';

export const dynamoDBService = new DynamoDBService(TABLE_NAME);
