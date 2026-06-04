import { relative, resolve } from 'path';
import { SUMMARY_PATH } from './constants';
import { getInputs } from './inputs';
import type { InputsSommand } from './types';

export const getVersionCommand = (filter = '.') => {
  const command = [
    'node',
    '-p',
    `require('${filter}/package.json').version`,
  ];

  return command.join(' ');
};

export const getPublishedsCommand = (summaryPath = SUMMARY_PATH) => {
  return `node -p 'JSON.stringify(require("${summaryPath}").publishedPackages, null, 2)'`;
};

export const getPackageJson = (filter: string) => {
  const _path = relative('.', resolve(filter, 'package.json'));
  return `./${_path}`;
};

export const constructComand = ({
  access,
  tag,
  publishBranch,
  filter,
  dry_run,
  provenance,
  force,
}: InputsSommand) => {
  const commands = ['pnpm', 'publish', '-r'];
  if (access.length > 0) {
    commands.push('--access', access);
  } else {
    commands.push('--access', 'public');
  }
  if (tag.length > 0) commands.push('--tag', tag);
  if (dry_run) commands.push('--dry-run');
  if (filter.length > 0) commands.push('--filter', filter);
  if (force) commands.push('--force');
  if (provenance) commands.push('--provenance');

  if (publishBranch.length > 0) {
    commands.push('--publish-branch', publishBranch);
  }

  commands.push('--no-git-checks');
  commands.push('--ignore-scripts');
  commands.push('--report-summary');

  return commands;
};

export const buildCommand = () => {
  const inputs = getInputs();
  const command = constructComand(inputs);

  return { command: command.join(' '), inputs };
};
