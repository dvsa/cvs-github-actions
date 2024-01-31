# Terraform Plan

Runs a Terraform Plan and uploads it as an artifact. If Terraform isn't initialised, it will initialise with default values.

## Inputs

This action requires the following inputs:
- options: Additional options to send to the Terraform Plan command (e.g. `-destroy`)
- validate: (optional) Run a Validation of the Terraform Code - defaults to `true`
- plan-retention: (optional) Number of days for the Plan File to be valid - defaults to `5`

## Outputs

This action does not produce any outputs

## Usage Example
```
- name: Terraform Initialize
  uses: dvsa/cvs-github-actions/terraform-initialize@develop
  with:
    environment: cb2-1099
    terraform-version: 1.5.0

- name: Terraform Plan
  uses: dvsa/cvs-github-actions/terraform-plan@develop
  with:
    options: '-destroy'
    validate: 'false'
```