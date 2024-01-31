# cvs-github-actions
The repository that will hold the reusable workflows and actions to be used by the cvs project

## .github/workflows
- node-ci.yaml
  - For node backend repositories
- build-mobile.yaml
  - For building vta application files
- test-mobile.yaml
  - For running the automation suite for vta

## DVSA GitHub Actions
Actions for use by other workflows are stored in their own folder within the root of the repository.

### Usage Examples

**Calculate Environment Values for a given Environment/Branch Name**
```
jobs:
...
  steps:
    - name: ↕️ Get Environment Details
      id: environment
      uses: dvsa/cvs-github-actions/environment@develop
      with:
        environment: ${{ inputs.environment || github.ref_name }}
```

**Seed A Table**
```
jobs:
...
  steps:
  - name: 🌱 Re-Seed Table
    uses: dvsa/cvs-github-actions/table-seed@develop
    with:
      table: [Full table name]
      seed-file: [Location of Seed File]
```