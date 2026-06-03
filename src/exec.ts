import { exec as _exec } from '@actions/exec';
import { $ } from 'zx';
import { buildCommand } from './command';
import { createNpmrc } from './npmrc';
import type { Output } from './types';

export const exec = async () => {
  const { command, inputs } = buildCommand();
  const workspace = process.env.GITHUB_WORKSPACE?.trim();

  $.cwd = workspace && workspace.length > 0 ? workspace : process.cwd();

  createNpmrc({
    authToken: inputs.AUTH,
    registry: inputs.registry,
  });

  const lines: string[] = [];

  await _exec(command, [], {
    listeners: {
      stdline(data) {
        lines.push(data);
      },
    },
  });

  const raw = lines.join('\n').trim();
  const _index = raw.indexOf('[');
  const str = _index >= 0 ? raw.slice(_index).trim() : raw;

  const result: Output[] | undefined =
    str.length > 0 ? JSON.parse(str) : undefined;

  return {
    result,
    inputs,
  };
};
