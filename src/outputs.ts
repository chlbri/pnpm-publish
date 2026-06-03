import { setOutput } from '@actions/core';
import type { OutputExtended } from './types';

const setOuput2 = (name: string, data?: string) => {
  if (!data) return;
  setOutput(name, data);
};

export const saveOuputs = ({
  name,
  access,
  dry_run,
  old_version,
  version,
  tag,
  released,
}: OutputExtended) => {
  setOuput2('name', name);
  setOuput2('new-version', version);
  setOuput2('tag', tag);
  setOuput2('access', access);
  setOuput2('released', released);
  setOuput2('old-version', old_version);
  setOuput2('dry-run', dry_run);
};
