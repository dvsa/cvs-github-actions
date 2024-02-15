# Drop Table Schema

Drops a given Schema from a MySQL Database

## Inputs

This action requires the following inputs:
- environment-name: An Environment identifier (e.g. `cb2-1099`)
- environment-type: The type of the Environment (e.g. `feature`, `develop` etc)
- schema: The base name of the Schema to drop (e.g. `CVSNOP`)
- dry-run: Don't perform destructive actions, only show output

## Outputs

This action does not produce any outputs

## Notes
- This action can use AWS Profiles created in a previous job
- Optionally, a specific role can be provided which will be removed once the job has run

## Usage Example
### Using AWS Profiles
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

      - name: Configure AWS Profile
        uses: dvsa/cvs-github-actions/aws-profile-configure@develop
        with:
          actions-role: ${{ secrets.MAIN_ROLE }}
          aws-region: ${{ vars.AWS_REGION }}
          role-session-name: MySessionName
          main-role: ${{secrets.TF_ROLE }}
          mgmt-role: ${{ secrets.MGMT_TF_ROLE }}

  drop-schema:
    runs-on: [runner]

    steps:
      - name: Drop WMS Schema
        uses: dvsa/cvs-github-actions/mysql-drop-schema@develop
        with:
          environment-name: cb2-1099
          environment-type: feature
          schema: EDH_WMS_STAGING
          dry-run: no
```
### Using a provided AWS Role
```
...
  drop-schema:
    runs-on: [runner]

    steps:
      - name: Drop WMS Schema
        uses: dvsa/cvs-github-actions/mysql-drop-schema@develop
        with:
          environment-name: cb2-1099
          environment-type: feature
          schema: EDH_WMS_STAGING
          role-to-assume: ${{ secrets.MyAWSRole }}
          dry-run: no
```
