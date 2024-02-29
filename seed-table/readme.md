# Seed Table

Purges and (Re)Seeds a DynamoDB Table

## Inputs

This action requires the following inputs:
- table: The full name of the table to be seeded (e.g. `cvs-develop-defects`)
- seed-file: The relative path of the Seed File to use (e.g. `tests/resources/defects.json`)

## Outputs

This action does not produce any outputs

## Notes

This action makes use of the `table-seeder` action.

## Usage Example

```
- name: 🌱 Seed Table
  uses: dvsa/cvs-github-actions/seed-table@develop
  with:
    table: cvs-develop-defects
    seed-file: tests/resources/defects.json
```