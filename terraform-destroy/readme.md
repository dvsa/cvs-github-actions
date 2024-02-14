# Terraform Destroy

Destroys a given Terraformed Environment, including Hash Files created for any Lambdas

## Inputs

This action requires the following inputs:
- environment: An Environment Id to destroy (e.g. `cb2-1099`)
- terraform-version: (optional) The version of Terraform to use
- dry-run: Don't perform destructive actions, only show output

## Outputs

This action does not produce any outputs

## Notes
- This action relies on the AWS Credentials being created in a prior job.
- If Terraform is not initialized, this action will perform that activity

## Usage Example
```
jobs:
  environment:
    runs-on: [runner]
    outputs:
      environment-name: ${{ steps.environment.outputs.environment-name }}
      environment-type: ${{ steps.environment.outputs.environment-type }}
      github-branch: ${{ steps.environment.outputs.github-branch }}
  
    steps:
      - name: Get Environment Details
        id: environment
        uses: dvsa/cvs-github-actions/environment@develop
        with:
          environment: ${{ inputs.environment || github.ref_name }}

      - name: Configure AWS Profile
        uses: dvsa/cvs-github-actions/aws-profile-configure@develop
        with:
          actions-role: ${{ secrets.MAIN_ROLE }}
          aws-region: ${{ vars.AWS_REGION }}
          role-session-name: MySessionName
          main-role: ${{secrets.TF_ROLE }}
          mgmt-role: ${{ secrets.MGMT_TF_ROLE }}

  terraform-destroy:
    runs-on: [runner]

    steps:
      - name: Terraform Destroy
        uses: dvsa/cvs-github-actions/terraform-plan@develop
        with:
          environment-name:  ${{ needs.environment.outputs.environment-name }}
          dry-run: ${{ inputs.dry-run }}
          terraform-version: 1.7.2
...
      - name: Clean AWS Profile
          uses: dvsa/cvs-github-actions/aws-profile-clean@develop
```