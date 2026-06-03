import { $ } from 'zx';

export const listVersions = async (
  new_version: string,
  package_name: string,
) => {
  const command = $`pnpm view ${package_name} versions`;
  const versions: string[] = await command.json();
  const filteredVersions = versions.filter(
    version => version !== new_version,
  );
  return filteredVersions;
};

export const getPreviousVersion = async (
  new_version: string,
  package_name: string,
) => {
  const versions = await listVersions(new_version, package_name);
  const previousVersion = versions[versions.length - 1];
  return previousVersion;
};
