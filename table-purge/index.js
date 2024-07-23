const { DynamoDBClient, QueryCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

// Get the partition key and table name from command line arguments
const partitionKey = process.argv[2];
const tableName = process.argv[3];

if (!partitionKey || !tableName) {
    console.error("Usage: node index.js <partitionKey> <tableName>");
    process.exit(1);
}

// Initialize the DynamoDB client
const dynamoDb = new DynamoDBClient({ region: 'eu-west-1' });

// Query DynamoDB to get items with the specified partition key
const queryParams = {
    TableName: tableName,
    KeyConditionExpression: "id = :pk",
    ExpressionAttributeValues: {
        ":pk": { S: partitionKey }
    }
};

dynamoDb.send(new QueryCommand(queryParams))
    .then(data => {
        const items = data.Items;

        if (!items || items.length === 0) {
            console.log("No items found with partition key", partitionKey);
            return;
        }

        // Prepare the batch delete request
        const deleteRequests = items.map(item => ({
            DeleteRequest: {
                Key: {
                    id: { S: item.id.S },
                    // Assuming sortKey exists. If not, remove this or handle accordingly.
                    sortKey: item.sortKey ? { S: item.sortKey.S } : undefined 
                }
            }
        }));

        const batchWriteParams = {
            RequestItems: {
                [tableName]: deleteRequests
            }
        };

        return dynamoDb.send(new BatchWriteItemCommand(batchWriteParams));
    })
    .then(() => {
        console.log("Successfully deleted items with partition key", partitionKey);
    })
    .catch(err => {
        console.error("Error:", err);
    });
