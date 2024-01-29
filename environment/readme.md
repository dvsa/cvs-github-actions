# Environment Details

Calculates relevant information about a given Environment Id (either a GitHub Branch or Environment Id)

## Inputs

This action requires the following inputs:
- environment: A Branch/Environment Id to calculate (e.g. `cb2-1099`, `feature/CB2-1099`, `release/v1.0.99`, `develop` etc)

## Outputs

This action produces the following outputs:
- environment-name: The name of the Environment used within AWS (e.g. `develop`, `cb2-1099`, `vta-1099`, `v1.0.99` etc)
- environment-type: The type of Environment (e.g. `feature`, `release`, `develop`, `preprod` etc)
- github-branch: The actual GitHub Branch related to the Environment (e.g. `feature/CB2-1099`, `release/v1.0.99`, `develop` etc)

## Validation

If the branch Id provided is not related to one of the core environment types (feature, release, develop, devops, integration, preprod, prod) then the action will reject the input and cause the workflow to fail.

## Usage Examples
### Inside a Job
This can be run as just another step within a job

```
...
on:
  workflow_dispatch:
    inputs:
      environment: 
        description: The environment to work within (if different from selected branch)
        type: string
        required: false
...
jobs:
  preparation:
    runs-on: [runner]

    steps:
      - name: Get Environment Details
        id: environment
        uses: dvsa/cvs-github-actions/environment@develop
        with:
          environment: ${{ inputs.environment || github.ref_name }}

      - name: Get Codebase
          uses: actions/checkout@v4
          with:
            ref: ${{ steps.environment.outputs.github-branch }}
...
```

### Outside a Job
In order to use the output to set as the running environment for a job, it must be in a separate job

```
...
on:
  workflow_dispatch:
    inputs:
      environment: 
        description: The environment to work against (if different from selected branch)
        type: string
        required: false
...
jobs:
  preparation:
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

  run-task:
    runs-on: [runner]
    needs: preparation
    environment: ${{ needs.preparation.outputs.environment-type }}

    steps:
      - name: Get Codebase
          uses: actions/checkout@v4
          with:
            ref: ${{ needs.preparation.outputs.github-branch }}
...
```

In the above examples `${{ inputs.environment || github.ref_name }}` will use the 'environment' input if it is supplied within the Workflow Dispatch, otherwise it will use the branch selected from the Workflow Dispatch branch drop-down.