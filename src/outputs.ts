import { setOutput } from '@actions/core';
import type { OutputExtended } from './types';

export const saveOuputs = (output: OutputExtended) => {
  setOutput('name', output.name);
  setOutput('new_version', output.version);
  setOutput('tag', output.tag);
  setOutput('access', output.access);
  setOutput('released', output.released);
  setOutput('old_version', output.old_version);
  setOutput('dry_run', output.dry_run);
};
