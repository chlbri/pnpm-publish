# pnpm-publish

A GitHub Action to publish packages to the npm registry using **pnpm**, with all `pnpm publish` options exposed as inputs.

## Usage

```yaml
- name: Publish package
  uses: chlbri/pnpm-publish@v1
  with:
    access: 'public'
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `version` | Version of pnpm to use | `latest` |
| `working-directory` | Working directory to run pnpm publish in | `.` |
| `access` | Set package access: `public` or `restricted` | |
| `tag` | Register the published package under the given dist-tag | |
| `dry-run` | (Boolean) Simulate the publish without actually publishing | `false` |
| `publish-branch` | Branch from which the package should be published | |
| `no-git-checks` | (Boolean) Disable checks for git tags and uncommitted changes | `false` |
| `filter` | Publish only packages matching the filter | |
| `recursive` | (Boolean) Publish all packages in the workspace | `false` |
| `report-summary` | (Boolean) Save publish report to `pnpm-publish-summary.json` | `false` |
| `force` | Publish even if the package is already in the registry | `false` |

## Outputs

| Output | Description | Type |
|--------|-------------|------|
| `name` | The name of the package | `string` |
| `old-version` | The version of the package before publish | `string` |
| `new-version` | The version of the package after publish | `string` |
| `released` | Whether the package was released | `boolean` |
| `tag` | The tag used for the release | `string` |

## Examples

### Publish a scoped public package

```yaml
- uses: chlbri/pnpm-publish@v1
  with:
    access: 'public'
    tag: 'latest'
```

### Publish all packages in a monorepo workspace

```yaml
- uses: chlbri/pnpm-publish@v1
  with:
    recursive: true
    no-git-checks: true
```

### Dry-run publish

```yaml
- uses: chlbri/pnpm-publish@v1
  with:
    dry-run: true
```

### Full workflow example

```yaml
name: Publish

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - uses: chlbri/pnpm-publish@v1
        with:
          access: 'public'
          no-git-checks: true
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## License

MIT
