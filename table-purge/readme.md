# Table Purge

Crawls a DynamoDB Table and deletes each Item found

## Inputs

This action requires the following inputs:
- table: The full name of the table to be seeded (e.g. `cvs-develop-defects`)

## Outputs

This action does not produce any outputs

## Usage Example

```
- name: 🧹 Purge Table
  uses: dvsa/cvs-github-actions/table-purge@develop
  with:
    table: cvs-develop-defects
```