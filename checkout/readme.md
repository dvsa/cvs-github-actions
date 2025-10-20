# Checkout

Wrapper for the checkout GitHub Action. Calculates default branch if `develop` is provided.

## Inputs

This action requires the following inputs:
- token: The GitHub Token to allow reading GitHub Repos
- repository: The DVSA Repository name to checkout
- branch: The branch, or ref, to checkout (defaults to `develop`)

## Outputs

This action does not produce any outputs

## Notes
- This action relies on the AWS Credentials being created in a prior step.
- If Terraform is not initialized, this action will perform that activity

## Usage Example
```
...
jobs:

  terraform-plan:
    runs-on: [runner]

    steps:
      - name: 📥 Get Codebase
        uses: dvsa/cvs-github-actions/checkout@develop
        with:
          token: ${{ secrets.GH_TOKEN }}
          repository: cvs-${{ inputs.service }}-service
          branch: ${{ github.ref_name }}