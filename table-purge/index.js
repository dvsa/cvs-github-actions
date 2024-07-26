const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

// Retrieve inputs from command line arguments
const args = process.argv.slice(2);
const partitionKey = args[0];
const tableName = args[1];
const partitionKeyName = args[2];
const sortKeyName = args[3] || null; // Handle optional sort key

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

// Main function to query and delete items
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

// Run the main function
queryAndDeleteItems();
