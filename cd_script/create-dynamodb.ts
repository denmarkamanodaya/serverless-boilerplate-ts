import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { client } from '../src/models/dynamodb';

async function createCasesTable() {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: 'Cases',
        AttributeDefinitions: [
          { AttributeName: 'caseId', AttributeType: 'S' }, // STRING
        ],
        KeySchema: [{ AttributeName: 'caseId', KeyType: 'HASH' }],
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      }),
    );
    console.log('Table created!');
  } catch (err: any) {
    if (err.name === 'ResourceInUseException') {
      console.log('Table already exists');
    } else {
      console.error(err);
    }
  }
}

async function createClientsTable() {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: 'Clients',
        AttributeDefinitions: [
          { AttributeName: 'clientId', AttributeType: 'S' }, // STRING
        ],
        KeySchema: [{ AttributeName: 'clientId', KeyType: 'HASH' }],
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      }),
    );
    console.log('Table created!');
  } catch (err: any) {
    if (err.name === 'ResourceInUseException') {
      console.log('Table already exists');
    } else {
      console.error(err);
    }
  }
}

createCasesTable();
createClientsTable();
