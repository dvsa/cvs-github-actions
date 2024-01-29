# Terraform Destroy

Destroys a given Terraformed Environment, including Hash Files created for any Lambdas

## Inputs

This action requires the following inputs:
- environment: An Environment Id to destroy (e.g. `cb2-1099`)
- terraform-version: (optional) The version of Terraform to use
- dry-run: Don't perform destructive actions, only show output

## Outputs

This action does not produce any outputs

## Usage Example
```
- name: Terraform Destroy
  uses: dvsa/cvs-github-actions/terraform-destroy@develop
  with:
    environment: cb2-1099
    dry-run: 'false'
```