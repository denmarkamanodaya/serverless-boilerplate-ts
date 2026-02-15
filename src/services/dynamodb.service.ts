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

    constructor(tableName: string, region: string = 'local', endpoint: string = 'http://localhost:8000') {
        const client = new DynamoDBClient({
            region,
            endpoint,
            credentials: {
                accessKeyId: 'LOCAL',
                secretAccessKey: 'LOCAL',
            },
        });
        this.docClient = DynamoDBDocumentClient.from(client);
        this.tableName = tableName;
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

    async query(keyConditionExpression: string, expressionAttributeValues: Record<string, any>) {
        return this.docClient.send(
            new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: keyConditionExpression,
                ExpressionAttributeValues: expressionAttributeValues,
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

    async scan(filterExpression?: string, expressionAttributeValues?: Record<string, any>) {
        const params: any = {
            TableName: this.tableName,
        };

        if (filterExpression) {
            params.FilterExpression = filterExpression;
        }

        if (expressionAttributeValues) {
            params.ExpressionAttributeValues = expressionAttributeValues;
        }

        return this.docClient.send(new ScanCommand(params));
    }
}
