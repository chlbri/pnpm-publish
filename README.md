# pnpm-publish

A GitHub Action that wraps `pnpm publish` and exposes the publish options
used by this repository.

## Usage

```yaml
- name: Publish package
  uses: chlbri/pnpm-publish@v0.5.0
  with:
    access: public
    tag: latest
```

The action always runs `pnpm publish --json --no-git-checks` and adds extra
flags from the provided inputs.

## Inputs

| Input            | Description                                                      | Default   |
| ---------------- | ---------------------------------------------------------------- | --------- |
| `access`         | Registry access level for the package: `public` or `restricted`. | `''`      |
| `tag`            | Dist-tag assigned to the published version.                      | `''`      |
| `dry-run`        | Simulate the publish without uploading the package.              | `'false'` |
| `publish-branch` | Branch name passed to `pnpm publish --publish-branch`.           | `''`      |
| `filter`         | Publish only packages matching the filter selector.              | `''`      |
| `force`          | Publish even if the version is already available.                | `'false'` |
| `provenance`     | Add `--provenance` to the publish command.                       | `'false'` |
| `AUTH`           | Optional auth token input reserved for registry configuration.   | `''`      |
| `registry`       | Registry selector: `npm`, `github`, or a full registry URL.      | `'npm'`   |

## Outputs

| Output        | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `name`        | Published package name.                                     |
| `old-version` | Previous version resolved from the registry before publish. |
| `new-version` | Version returned by `pnpm publish`.                         |
| `released`    | `true` when a package was published, otherwise `false`.     |
| `tag`         | Tag returned by the action run.                             |
| `access`      | Access level of the published package.                      |
| `dry-run`     | `true` if this was a dry run, otherwise `false`.            |

## Examples

### Dry run

```yaml
- uses: chlbri/pnpm-publish@v0.5.0
  with:
    dry-run: true
    tag: next
```

### Capture publish metadata

```yaml
- id: publish
  uses: chlbri/pnpm-publish@v0.5.0
  with:
    access: public

- name: Print release information
  run: |
    echo "name=${{ steps.publish.outputs.name }}"
    echo "old=${{ steps.publish.outputs['old-version'] }}"
    echo "new=${{ steps.publish.outputs['new-version'] }}"
    echo "released=${{ steps.publish.outputs.released }}"
```

### Workflow example

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
          node-version: 22
          registry-url: https://registry.npmjs.org

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: chlbri/pnpm-publish@v0.5.0
        with:
          access: public
          provenance: true
        env:
          AUTH: ${{ secrets.NPM_TOKEN }}
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT
