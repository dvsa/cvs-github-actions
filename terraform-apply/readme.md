# Terraform Apply

Applies a Terraform Plan that from the current GitHub Actions Run. If Terraform isn't initialised, it will initialise with default values.

## Inputs

This action requires the following inputs:
- options: Additional options to send to the Terraform Plan command (e.g. `-destroy`)
- plan-id: (optional) The Terraform Plan to retrieve - defaults to `plan-[github.run_id]`

## Outputs

This action does not produce any outputs

## Usage Example
```
- name: Terraform Plan
  uses: dvsa/cvs-github-actions/terraform-plan@develop
  with:
    options: '-destroy'
    validate: 'false'

- name: Terraform Apply
  uses: dvsa/cvs-github-actions/terraform-apply@develop
```