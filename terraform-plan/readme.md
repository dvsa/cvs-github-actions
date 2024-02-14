# Terraform Plan

Runs a Terraform Plan and uploads it as an artifact. If Terraform isn't initialised, it will initialise with default values.

## Inputs

This action requires the following inputs:
- options: Additional options to send to the Terraform Plan command (e.g. `-destroy`)
- validate: (optional) Run a Validation of the Terraform Code - defaults to `true`
- plan-retention: (optional) Number of days for the Plan File to be valid - defaults to `5`

## Outputs

This action does not produce any outputs

## Notes
- This action relies on the AWS Credentials being created in a prior step.
- If Terraform is not initialized, this action will perform that activity

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

      - name: Terraform Plan
        uses: dvsa/cvs-github-actions/terraform-plan@develop
        with:
          options: '-destroy'
          validate: 'false'
...
      - name: Clean AWS Profile
          uses: dvsa/cvs-github-actions/aws-profile-clean@develop
```