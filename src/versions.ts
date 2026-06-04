import { relative, resolve } from 'path';
import * as v from 'valibot';
import { safeExec, warnErrors } from './helpers';

export const listVersions = async (
  new_version: string,
  package_name: string,
) => {
  const command = `pnpm view ${package_name} versions`;
  const { errors, result } = await safeExec(command, v.array(v.string()));
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

export const getCurrentVersion = async (filter: string) => {
  const _path = relative('.', resolve(filter, 'package.json'));
  const path = `./${_path}`;
  const command = `node -p "require('${path}').version"`;
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
