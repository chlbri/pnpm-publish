import { exec as _exec } from '@actions/exec';
import { exec } from './exec';
import { saveOuputs } from './outputs';
import { getPreviousVersion } from './versions';

const action = async () => {
  const { inputs, result } = await exec();

  if (result === undefined || result.length === 0) {
    const lines: string[] = [];

    await _exec('node -p "require(\'./package.json\').version"', [], {
      listeners: {
        stdline(data) {
          lines.push(data);
        },
      },
    });

    const old_version = lines[0].trim();
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

action();
