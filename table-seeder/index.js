#!/usr/bin/env node

const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const core = require('@actions/core');

const fs = require('fs');
const path = require('path');

seedTable();

async function seedTable() {
  const dbClient = DynamoDBDocument.from(new DynamoDB({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  }));

  const tableName = core.getInput('table');
  const resourceLocation = core.getInput('seed-file');

  const resource = JSON.parse(
    fs.readFileSync(path.resolve(resourceLocation)),
  );
  let batches = [];

  while (resource.length > 0) {
    batches.push(resource.splice(0, 25));
  }

  for (const batch of batches) {
    let query = {
      RequestItems: {},
    };
    query.RequestItems[tableName] = [];

    for (const item of batch) {
      try {
        if (item['testStationEmails']) {
          item['testStationEmails'] = [
            'automation@nonprod.cvs.dvsacloud.uk',
          ];
        }
      } catch (e) {
        // Ignore non-test stations files
      }
      query.RequestItems[tableName].push({
        PutRequest: {
          Item: item,
        },
      });
    }

    dbClient
      .batchWrite(query)
      .then((result) => {
        console.info(JSON.stringify(result));
      })
      .catch((error) => {
        console.error(JSON.stringify(error));
      });

    await sleep(100);
  };
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

