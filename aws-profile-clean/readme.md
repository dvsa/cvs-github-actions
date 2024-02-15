# Clean AWS Profiles

Remove AWS Profile information from Runner

## Inputs

This action does not require any inputs


## Outputs

This action does not create any Outputs

## Notes
- The `Configure AWS Profile` action, used in conjunction with this action, creates 'shared' credentials on the runner

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