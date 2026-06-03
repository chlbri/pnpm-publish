import { getInputs } from './inputs';

export const buildCommand = () => {
  const command = ['pnpm', 'publish'];
  const inputs = getInputs();

  const access = inputs.access;
  const tag = inputs.tag;
  const publishBranch = inputs.publishBranch;
  const filter = inputs.filter;

  if (access.length > 0) command.push('--access', access);
  if (tag.length > 0) command.push('--tag', tag);
  if (inputs.dry_run) command.push('--dry-run');
  if (filter.length > 0) command.push('--filter', filter);
  if (inputs.force) command.push('--force');
  if (inputs.provenance) command.push('--provenance');

  if (publishBranch.length > 0) {
    command.push('--publish-branch', publishBranch);
  }

  command.push('--json');
  command.push('--no-git-checks');

  return { command: command.join(' '), inputs };
};
