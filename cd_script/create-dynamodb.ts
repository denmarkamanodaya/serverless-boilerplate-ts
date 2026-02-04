import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "../src/models/dynamodb";

async function createTable() {
  try {
    await ddbDocClient.send(
      new CreateTableCommand({
        TableName: "MyTable",
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "N" }, // STRING
          { AttributeName: "id", AttributeType: "N" }      // STRING
        ],
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "id", KeyType: "RANGE" }
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
