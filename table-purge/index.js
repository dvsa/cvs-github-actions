const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

// Retrieve inputs from environment variables
const partitionKeyValue = process.env.PARTITION_KEY_VALUE;
const tableName = process.env.TABLE_NAME;
const partitionKeyName = process.env.PARTITION_KEY_NAME;
const sortKeyName = process.env.SORT_KEY_NAME || null; // Handle optional sort key

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const dynamoDb = DynamoDBDocumentClient.from(client);

async function queryItems(dynamoDb, tableName, partitionKeyName, partitionKeyValue) {
    const queryParams = {
        TableName: tableName,
        KeyConditionExpression: `${partitionKeyName} = :pk`,
        ExpressionAttributeValues: {
            ":pk": partitionKeyValue
        }
    };

    const queryCommand = new QueryCommand(queryParams);
    const data = await dynamoDb.send(queryCommand);
    return data.Items;
}

async function deleteItemsInBatches(dynamoDb, tableName, partitionKeyName, sortKeyName, items) {
    const batchSize = 25; // DynamoDB limits batch write to 25 items
    const batches = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize).map(item => {
            const key = { [partitionKeyName]: item[partitionKeyName] };
            if (sortKeyName && item[sortKeyName] !== undefined) {
                key[sortKeyName] = item[sortKeyName];
            }
            return {
                DeleteRequest: {
                    Key: key
                }
            };
        });
        batches.push(batch);
    }

    for (const batch of batches) {
        const batchWriteParams = {
            RequestItems: {
                [tableName]: batch
            }
        };

        const batchWriteCommand = new BatchWriteCommand(batchWriteParams);
        await dynamoDb.send(batchWriteCommand);

        console.log(`Processed batch of ${batch.length} items.`);
    }
}

async function queryAndDeleteItems() {
    try {
        const items = await queryItems(dynamoDb, tableName, partitionKeyName, partitionKeyValue);

        if (items.length === 0) {
            console.log("No items found with the partition key", partitionKeyValue);
            return;
        }

        console.log(`Found ${items.length} items to delete.`);
        await deleteItemsInBatches(dynamoDb, tableName, partitionKeyName, sortKeyName, items);
        console.log("Successfully deleted items with partition key", partitionKeyValue);
    } catch (err) {
        console.error("Error:", err);
    }
}

queryAndDeleteItems();
