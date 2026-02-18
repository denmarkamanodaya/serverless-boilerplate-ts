import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    QueryCommand,
    DeleteCommand,
    UpdateCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export class DynamoDBService {
    private docClient: DynamoDBDocumentClient;
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;

        const isOffline = process.env.IS_OFFLINE === 'true';
        const useProd = process.env.USE_PROD_DB === 'true';

        const clientConfig: any = {
            region: process.env.AWS_REGION || 'us-east-1',
        };

        if (isOffline && !useProd) {
            // Local development mode
            console.log(`[DynamoDBService] Connecting to local DynamoDB at ${process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'}`);
            clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
            clientConfig.credentials = {
                accessKeyId: 'LOCAL',
                secretAccessKey: 'LOCAL',
            };
        } else {
            // Production or hitting Prod from local
            if (useProd) {
                console.log(`[DynamoDBService] Offline mode detected, but USE_PROD_DB is true. Connecting to AWS...`);
            } else {
                console.log(`[DynamoDBService] Connecting to AWS DynamoDB in ${clientConfig.region}`);
            }

            // Note: If running locally without USE_PROD_DB, it falls into the first block.
            // If running in AWS or locally with USE_PROD_DB, we don't set endpoint or credentials.
            // The AWS SDK will automatically use environment variables (AWS_ACCESS_KEY_ID, etc.)
            // or the default credential provider chain.
        }

        const client = new DynamoDBClient(clientConfig);
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    async put(item: Record<string, any>, conditionExpression?: string) {
        const params: any = {
            TableName: this.tableName,
            Item: item,
        };
        if (conditionExpression) {
            params.ConditionExpression = conditionExpression;
        }
        return this.docClient.send(new PutCommand(params));
    }

    async get(key: Record<string, any>) {
        return this.docClient.send(
            new GetCommand({
                TableName: this.tableName,
                Key: key,
            }),
        );
    }

    async query(keyConditionExpression: string, expressionAttributeValues: Record<string, any>, options: any = {}) {
        return this.docClient.send(
            new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: keyConditionExpression,
                ExpressionAttributeValues: expressionAttributeValues,
                ...options
            }),
        );
    }

    async delete(key: Record<string, any>) {
        return this.docClient.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: key,
            }),
        );
    }

    async update(key: Record<string, any>, updateExpression: string, expressionAttributeNames: Record<string, string>, expressionAttributeValues: Record<string, any>) {
        return this.docClient.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: key,
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
            }),
        );
    }

    async scan(filterExpression?: string, expressionAttributeValues?: Record<string, any>, expressionAttributeNames?: Record<string, string>) {
        const params: any = {
            TableName: this.tableName,
        };

        if (filterExpression) {
            params.FilterExpression = filterExpression;
        }

        if (expressionAttributeValues) {
            params.ExpressionAttributeValues = expressionAttributeValues;
        }

        if (expressionAttributeNames) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        return this.docClient.send(new ScanCommand(params));
    }
}
