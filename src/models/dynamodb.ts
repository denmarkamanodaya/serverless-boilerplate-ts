import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const endpoint = process.env.DYNAMODB_ENDPOINT; // local DynamoDB endpoint

// Test
const client = new DynamoDBClient({
    region: "local",
    endpoint,
    credentials: {
        accessKeyId: "LOCAL",         // dummy keys (not used locally)
        secretAccessKey: "LOCAL",
    },
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);