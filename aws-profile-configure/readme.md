# Configure AWS Profiles

Create a set of AWS Profiles on the runner for use with Terraform

## Inputs

This action requires the following inputs:
- actions-role: An AWS ARN representing the role to assume within GitHub (i.e. the `github-actions` role)
- aws-region: (Optional) The AWS Region in which to run (default `eu-west-1`)
- role-session-name: (Optional) A name to give your session (default `github-actions`)
- main-role: AWS ARN containing the environment specific role to assume (i.e. within `nonprod` or `prod`)
- mgmt-role: AWS ARN containing the Management Account role to assume

## Outputs

This action does not create any outputs

## Notes
- This action uses (so replaces) the `aws-actions/configure-aws-credentials` action
- The `Clean AWS Profile` action, used in conjunction with this action, removes any credentials from the runner

## Usage Examples
```
...
  run-task:
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
...
      - name: Clean AWS Profile
        if: always()
        uses: dvsa/cvs-github-actions/aws-profile-clean@develop
```