# Dynamo Export

Backs up a DynamoDB Table to S3

## Inputs

This action requires the following inputs:
- table: The full name of the table to be seeded (e.g. `cvs-develop-defects`)
- s3-bucket: The S3 Bucket to store the backups in
- s3-key: (Optional) The S3 'folder' to store backups in
- environment: The AWS Environment the table lives in (e.g. `develop`, `prod` etc) 
- enable-backups: Should continuous backups be left un the `running` state (default: `true`)

## Outputs

This action does not produce any outputs

## Usage Example

```
- name: Dynamo Export
  uses: dvsa/cvs-github-actions/dynamo-export@develop
  with:
    table: cvs-develop-defects
    s3-bucket: cvs-tf-data
    environment: develop
```