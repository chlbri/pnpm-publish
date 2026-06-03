import { getInput } from '@actions/core';

export const getInputs = () => {
  const inputs = {
    access: getInput('access').trim(),
    tag: getInput('tag').trim(),
    publishBranch: getInput('publish-branch').trim(),
    filter: getInput('filter').trim(),
    dry_run: getInput('dry-run').trim() === 'true',
    force: getInput('force').trim() === 'true',
    provenance: getInput('provenance').trim() === 'true',
    AUTH: getInput('AUTH').trim(),
    registry: getInput('registry').trim(),
  };

  return inputs;
};
