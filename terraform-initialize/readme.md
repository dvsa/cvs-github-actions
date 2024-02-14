# Terraform Initialize

Installs and Initializes Terraform for use

## Inputs

This action requires the following inputs:
- environment: An Environment Id to destroy (e.g. `cb2-1099`)
- terraform-version: (optional) The version of Terraform to use - defaults to version 1.3.9

## Outputs

This action does not produce any outputs

## Notes
- This action relies on the AWS Credentials being created in a prior step.

## Usage Example
```
...
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

  terraform-plan:
    runs-on: [runner]
    
    steps:
      - name: Configure AWS Profile
        uses: dvsa/cvs-github-actions/aws-profile-configure@develop
        with:
          actions-role: ${{ secrets.MAIN_ROLE }}
          aws-region: ${{ vars.AWS_REGION }}
          role-session-name: MySessionName
          main-role: ${{secrets.TF_ROLE }}
          mgmt-role: ${{ secrets.MGMT_TF_ROLE }}

      - name: Terraform Initialize
        uses: dvsa/cvs-github-actions/terraform-initialize@develop
        with:
          environment: cb2-1099
          terraform-version: 1.5.0
```