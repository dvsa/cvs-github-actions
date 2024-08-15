# Dynamo Export

Backs up a DynamoDB Table to S3

## Inputs

This action requires the following inputs:
- table: The full name of the table to be seeded (e.g. `cvs-develop-defects`)
- destination: Where should the export/restore be placed (i.e. `S3 Only` or `Preprod & S3`)
- enable-backups: Should continuous backups be left in the `running` state (default: `true`)

## Outputs

This action does not produce any outputs

## Usage Example

```
- name: Dynamo Export
  uses: dvsa/cvs-github-actions/dynamo-export@develop
  with:
    table: cvs-develop-defects
    destination: S3 Only
```