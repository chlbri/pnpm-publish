import { exec } from './exec';
import { saveOuputs } from './outputs';
import { getPreviousVersion } from './versions';

const action = async () => {
  const { inputs, result } = await exec();
  if (result === undefined || result.length === 0) {
    return saveOuputs({
      released: 'false',
      tag: inputs.tag,
      access: inputs.access,
      dry_run: String(inputs.dry_run),
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
