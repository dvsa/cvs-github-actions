const core = require('@actions/core');
const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

        // Handle reserved keywords
        const expressionAttributeNames = {};
        let projectionExpression = hashKey;
        if (hashKey.toLowerCase() === 'name') {
            expressionAttributeNames['#hashKey'] = hashKey;
            projectionExpression = '#hashKey';
        }
        if (rangeKey) {
            if (rangeKey.toLowerCase() === 'name') {
                expressionAttributeNames['#rangeKey'] = rangeKey;
                projectionExpression += ', #rangeKey';
            } else {
                projectionExpression += `, ${rangeKey}`;
            }
        }

        // Scan the table to get all items
        let scanParams = {
            TableName: tableName,
            ProjectionExpression: projectionExpression,
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
        };

        let scanResult;
        let batchFiles = [];
        let batchIndex = 0;

        // Create a temporary directory for batch files
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'batch-'));

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

                // Save batch to a file
                const batchFileName = path.join(tempDir, `batch_${batchIndex}.json`);
                fs.writeFileSync(batchFileName, JSON.stringify(deleteRequests));
                batchFiles.push(batchFileName);
                batchIndex++;
            }

            scanParams.ExclusiveStartKey = scanResult.LastEvaluatedKey;

        } while (typeof scanResult.LastEvaluatedKey !== 'undefined');

        // Process batch files for deletion
        for (const batchFile of batchFiles) {
            const deleteRequests = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
            if (dryRun) {
                console.log(`Dry run - would delete batch with keys: ${JSON.stringify(deleteRequests)}`);
                await core.summary.addHeading('Dry run - Batch Deletion');
                await core.summary.addRaw(`Would delete batch with keys: \n\`\`\`json\n${JSON.stringify(deleteRequests, null, 2)}\n\`\`\``);
            } else {
                console.log(`Deleting batch with keys: ${JSON.stringify(deleteRequests)}`);
                await docClient.send(new BatchWriteCommand({
                    RequestItems: {
                        [tableName]: deleteRequests
                    }
                }));
                await core.summary.addHeading('Batch Deletion');
                await core.summary.addRaw(`Deleted batch with keys: \n\`\`\`json\n${JSON.stringify(deleteRequests, null, 2)}\n\`\`\``);
            }
        }

        // Write summary
        await core.summary.write();

    } catch (error) {
        core.setFailed(`Action failed with error ${error}`);
    }
}

run();
