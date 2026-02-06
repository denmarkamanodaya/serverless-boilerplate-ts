import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "../src/models/dynamodb";

async function createTable() {
  try {
    await ddbDocClient.send(
      new CreateTableCommand({
        TableName: "MyTable",
        AttributeDefinitions: [
          { AttributeName: "taskId", AttributeType: "S" }, // STRING
          { AttributeName: "title", AttributeType: "S" },      // STRING
        ],
        KeySchema: [
          { AttributeName: "taskId", KeyType: "HASH" },
          { AttributeName: "title", KeyType: "RANGE" },
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
      })
    );
    console.log("Table created!");
  } catch (err: any) {
    if (err.name === "ResourceInUseException") {
      console.log("Table already exists");
    } else {
      console.error(err);
    }
  }
}

createTable();
