# Configure AWS Profiles

Create a set of AWS Profiles on the runner for use with Terraform

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