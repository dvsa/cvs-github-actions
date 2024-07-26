const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const partitionKey = process.env.partitionKey;
const tableName = process.env.table;
const partitionKeyName = process.env.partitionKeyName;
const sortKeyName = process.env.sortKeyName;

const client = new DynamoDBClient({ region: 'eu-west-1' });
const dynamoDb = DynamoDBDocumentClient.from(client);

async function queryItems(dynamoDb, tableName, partitionKeyName, partitionKey) {
    const queryParams = {
        TableName: tableName,
        KeyConditionExpression: `${partitionKeyName} = :pk`,
        ExpressionAttributeValues: {
            ":pk": partitionKey
        }
    };

    const queryCommand = new QueryCommand(queryParams);
    const data = await dynamoDb.send(queryCommand);
    return data.Items;
}

async function deleteItems(dynamoDb, tableName, partitionKeyName, sortKeyName, items) {
    const deleteRequests = items.map(item => {
        const key = { [partitionKeyName]: item[partitionKeyName] };
        if (sortKeyName) {
            key[sortKeyName] = item[sortKeyName];
        }
        return {
            DeleteRequest: {
                Key: key
            }
        };
    });

    const batchWriteParams = {
        RequestItems: {
            [tableName]: deleteRequests
        }
    };

    const batchWriteCommand = new BatchWriteCommand(batchWriteParams);
    await dynamoDb.send(batchWriteCommand);
}

async function queryAndDeleteItems() {
    try {
        const items = await queryItems(dynamoDb, tableName, partitionKeyName, partitionKey);

        if (items.length === 0) {
            console.log("No items found with the partition key", partitionKey);
            return;
        }

        await deleteItems(dynamoDb, tableName, partitionKeyName, sortKeyName, items);
        console.log("Successfully deleted items with partition key", partitionKey);
    } catch (err) {
        console.error("Error:", err);
    }
}

queryAndDeleteItems();
