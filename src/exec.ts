import { exec as _exec } from '@actions/exec';
import { buildCommand } from './command';
import { createNpmrc } from './npmrc';
import type { Output } from './types';

export const exec = async () => {
  const { command, inputs } = buildCommand();

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
