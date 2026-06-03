import { $, type ProcessOutput, } from 'zx';
import { buildCommand } from './command';
import type { Output } from './types';
import { createNpmrc } from './npmrc';

export const exec = async () => {
  const { command, inputs } = buildCommand();
  const workspace = process.env.GITHUB_WORKSPACE?.trim();

  $.cwd = workspace && workspace.length > 0 ? workspace : process.cwd();

  createNpmrc({
    authToken: inputs.AUTH,
    registry: inputs.registry,
  });

  const _process = $`${command}`;
  const result: Output[] | undefined = await _process
    .json()
    .catch((err: ProcessOutput) => {
      console.error('Error publishing:', err.toString());
    });

  return {
    result,
    inputs,
  };
};
