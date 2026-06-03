import { exec as _exec, getExecOutput } from '@actions/exec';
import { exec } from './exec';
import { saveOuputs } from './outputs';
import { getPreviousVersion } from './versions';

export const main = async () => {
  const { inputs, result } = await exec();

  if (result === undefined || result.length === 0) {
    const filter = inputs.filter.length > 0 ? inputs.filter : '.';
    const path = `${filter}/package.json`;

    const { stdout } = await getExecOutput(
      `node -p "require('${path}').version"`,
      [],
      {
        silent: true,
        ignoreReturnCode: true,
      },
    );

    const old_version = stdout.trim();

    return saveOuputs({
      tag: inputs.tag,
      access: inputs.access,
      dry_run: String(inputs.dry_run),
      old_version,
      version: old_version,
    });
  } else {
    const old_version = await getPreviousVersion(
      result[0].version!,
      result[0].name!,
    );

    const { name, version } = result[0];

    return saveOuputs({
      name,
      version,
      tag: inputs.tag,
      access: inputs.access,
      released: 'true',
      old_version,
      dry_run: String(inputs.dry_run),
    });
  }
};
