# Table Seeder

Seeds a given DynamoDB Table with the contents of a given Seed Data json file

## Inputs

This action requires the following inputs:
- table: The full name of the table to be seeded (e.g. `cvs-develop-defects`)
- seed-file: The relative path to the seed file - located in the source repository (e.g. `tests/resources/defects.json`)

## Outputs

This action does not produce any outputs

## Notes

This is called by the `seed-table` action which will first purge the data in the Table

## Usage Example

```
- name: 🌱 Re-Seed Table
  uses: dvsa/cvs-github-actions/table-seeder@develop
  with:
    table: cvs-develop-defects
    seed-file: tests/resources/defects.json
```