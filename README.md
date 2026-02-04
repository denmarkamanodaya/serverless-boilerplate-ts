# Serverless Boilerplate TS

## Pre-requisites
1. Node version 17 (hard requirement)

## Installation
1. ```npm install```
2. ```npm run offline``` to build using TSC and run offline via Serverless
3. ```docker run -p 8000:8000 amazon/dynamodb-local``` Run DynamoDB via Docker
4. Install DynamoDB Local
    Download: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html

    Unzip it somewhere.
    From the folder, run the command:
    java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -port 8000 -inMemory -sharedDb
    Make sure Java is installed
    
5. ```npx ts-node cd_script/create-dynamodb.ts``` Create DynamoDB table from TS script