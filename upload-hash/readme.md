# Upload Hashed Function to S3

- Locates Hashed Function Zip files generated in another step
- Generates a Hash File
- Uploads files to an S3 Bucket
- Optionally adds a Version Tag to the Function Zip file

## Inputs

This action takes the following inputs:
- commit-sha: The Commit SHA for the release (defaults to current GitHub SHA)
- package-name: The service name (e.g. `defects`)
- environment-name: Environment Name (e.g. `cb2-1099` or `release`)
- service-bucket: The Bucket holding the Service Function and Hash (defaults to `cvs-services`)
- version-number: The version number to tag resources with (optional)

## Outputs

This action does not produce any outputs

## Notes

Mostly used in conjunction with the build-function actions

## Usage Example

Build and Upload a Node Function
```
- name: 🏗️ Build Node Function
  uses: dvsa/cvs-github-actions/build-node-function@develop

- name: 📤 Upload hash zip to S3
  uses: dvsa/cvs-github-actions/upload-hash@develop
  with:
    package-name: defects
    environment-name: cb2-1099
```
