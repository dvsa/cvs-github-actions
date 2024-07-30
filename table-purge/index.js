const core = require('@actions/core');
const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

async function run() {
    try {
        const tableName = core.getInput('table');
        const dryRun = core.getInput('dry-run') === 'true';

        const client = new DynamoDBClient();
        const docClient = DynamoDBDocumentClient.from(client);

        // Get table key schema
        const describeTable = await client.send(new DescribeTableCommand({ TableName: tableName }));
        const keySchema = describeTable.Table.KeySchema;

        // Identify hash key and range key
        const hashKey = keySchema.find(key => key.KeyType === 'HASH').AttributeName;
        const rangeKey = keySchema.find(key => key.KeyType === 'RANGE') ? keySchema.find(key => key.KeyType === 'RANGE').AttributeName : null;

        // Scan the table to get all items
        let scanParams = {
            TableName: tableName,
            ProjectionExpression: hashKey + (rangeKey ? `, ${rangeKey}` : '')
        };

        let scanResult;
        do {
            scanResult = await docClient.send(new ScanCommand(scanParams));

            const items = scanResult.Items;

            // Delete items in batches of 25
            const batches = [];
            while (items.length) {
                batches.push(items.splice(0, 25));
            }

            for (const batch of batches) {
                const deleteRequests = batch.map(item => {
                    const key = {};
                    key[hashKey] = item[hashKey];
                    if (rangeKey) key[rangeKey] = item[rangeKey];

                    return {
                        DeleteRequest: {
                            Key: key
                        }
                    };
                });

                if (dryRun) {
                    console.log(`Dry run - would delete batch with keys: ${JSON.stringify(deleteRequests)}`);
                } else {
                    console.log(`Deleting batch with keys: ${JSON.stringify(deleteRequests)}`);
                    await docClient.send(new BatchWriteCommand({
                        RequestItems: {
                            [tableName]: deleteRequests
                        }
                    }));
                }
            }

            scanParams.ExclusiveStartKey = scanResult.LastEvaluatedKey;

        } while (typeof scanResult.LastEvaluatedKey !== 'undefined');

    } catch (error) {
        core.setFailed(`Action failed with error ${error}`);
    }
}

run();
