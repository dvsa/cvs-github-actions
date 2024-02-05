# Table Seed

Seeds a given DynamoDB Table with the contents of a given Seed Data json file

## Inputs

This action requires the following inputs:
- table: The full name of the table to be seeded (e.g. `cvs-develop-defects`)
- seed-file: The local path to the seed file - located in the source repository (e.g. `tests/resources/defects.json`)

## Outputs

This action does not produce any outputs

## Usage Example

```
- name: 🌱 Re-Seed Table
  uses: dvsa/cvs-github-actions/table-seed@develop
  with:
    table: cvs-develop-defects
    seed-file: tests/resources/defects.json
```