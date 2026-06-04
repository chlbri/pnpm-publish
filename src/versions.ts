import * as v from 'valibot';
import { getPackageJson } from './commands';
import { safeExec, warnErrors } from './helpers';
import { SchemaVersions } from './schemas';

export const listVersions = async (
  new_version: string,
  package_name: string,
) => {
  const command = `pnpm view ${package_name} versions --json`;
  const { errors, result } = await safeExec(command, SchemaVersions);
  errors.schema.forEach(warnErrors('JSON SCHEMA validation'));

  if (errors.stderr.length > 0) {
    console.warn('Some errors occured !!');
  }

  return result?.filter(v => v !== new_version);
};

export const getPreviousVersion = async (
  new_version: string,
  package_name: string,
) => {
  const versions = await listVersions(new_version, package_name);
  if (!versions || versions.length === 0) return new_version;
  return versions[versions.length - 1];
};

export const getFromPackage = async (key: string, filter: string) => {
  const path = getPackageJson(filter);
  const command = `node -p "require('${path}').${key}"`;
  const { errors, result } = await safeExec(
    command,
    v.pipe(v.string(), v.trim()),
  );
  errors.schema.forEach(warnErrors('JSON SCHEMA validation'));

  if (errors.stderr.length > 0) {
    console.warn('Some errors occured !!');
  }

  return result;
};

export const getCurrentVersion = async (filter: string) => {
  return getFromPackage('version', filter);
};

export const getPackageName = async (filter: string) => {
  return getFromPackage('name', filter);
};
