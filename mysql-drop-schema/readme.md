# Drop Table Schema

Drops a given Schema from a MySQL Database

## Inputs

This action requires the following inputs:
- environment-name: An Environment identifier (e.g. `cb2-1099`)
- environment-type: The type of the Environment (e.g. `feature`, `develop` etc)
- schema: The base name of the Schema to drop (e.g. `CVSNOP`)
- dry-run: Don't perform destructive actions, only show output

## Outputs

This action does not produce any outputs

## Usage Example
```
- name: Drop WMS Schema
  uses: dvsa/cvs-github-actions/mysql-drop-schema@develop
  with:
    environment-name: cb2-1099
    environment-type: feature
    schema: EDH_WMS_STAGING
    dry-run: no
```
