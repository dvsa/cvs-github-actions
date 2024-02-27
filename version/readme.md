# Bump SemVer or DatVer Version number

- Given a valid SemVer version, allow the number to be bumped
- Create a new Date Version in the format `[YEAR]-[MONTH]-[DAY].[BUILD]`

## Inputs

This action requires the following inputs:
- bump: The value to bump (one of `major`, `minor` or `patch`, defaults to `minor`)
- version-number: The actual SemVer Version (e.g. `1.0.99` or `2024-01-01.99`)
- number-type: The type of Version Number (one of `semver` or `datver`, defaults to `semver`)

## Outputs

This action produces the following outputs:
- version: The new Version Number (e.g. `1.1.99` or `2024-01-02.0`)

## Usage Example
Bump a SemVer Number
```
- name: Bump SemVer Version
  uses: dvsa/cvs-github-actions/version@develop
  with:
    bump: minor
    version-number: 1.0.99
    number-type: semver
```
Bump a DatVer Number
```
- name: Bump DatVer Version
  uses: dvsa/cvs-github-actions/version@develop
  with:
    version-number: 2024-01-01.99
    number-type: datver
```