const {DynamoDB} = require('@aws-sdk/client-dynamodb');
const core = require('@actions/core');

const partitionKey = core.getInput('partitionKey');
const tableName = core.getInput('table');

// Use the query method to retrieve all items with the specified partition key
const dynamoDb = new DynamoDB.Document();
dynamoDb.query({
    TableName: tableName,
    KeyConditionExpression: "partitionKey = :pk",
    ExpressionAttributeValues: {
        ":pk": partitionKey
    }
}, (err, data) => {
    if (err) {
        console.error("Error querying DynamoDB:", err);
    } else {
        // Extract the items from the query result
        const items = data.Items;

        // Use the batchWrite method to delete the items
        dynamoDb.batchWrite({
            RequestItems: {
                [tableName]: items.map(item => ({
                    DeleteRequest: {
                        Key: {
                            partitionKey: item.partitionKey,
                            sortKey: item.sortKey
                        }
                    }
                }))
            }
        }, (err) => {
            if (err) {
                console.error("Error deleting items from DynamoDB:", err);
            } else {
                console.log("Successfully deleted items with partition key", partitionKey);
            }
        });
    }
});