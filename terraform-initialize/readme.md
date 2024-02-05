# Terraform Initialize

Installs and Initializes Terraform for use

## Inputs

This action requires the following inputs:
- environment: An Environment Id to destroy (e.g. `cb2-1099`)
- terraform-version: (optional) The version of Terraform to use - defaults to version 1.3.9

## Outputs

This action does not produce any outputs

## Usage Example
```
- name: Terraform Initialize
  uses: dvsa/cvs-github-actions/terraform-initialize@develop
  with:
    environment: cb2-1099
    terraform-version: 1.5.0
```