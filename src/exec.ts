import { exec as _exec, getExecOutput } from '@actions/exec';
import {} from '@actions/core';
import { buildCommand } from './commands';
import { createNpmrc } from './npmrc';
import type { Output } from './types';
import { SUMMARY_PATH } from './constants';

export const exec = async () => {
  const { command, inputs } = buildCommand();

  createNpmrc({
    authToken: inputs.AUTH,
    registry: inputs.registry,
  });

  await _exec(command, [], {
    silent: true,
    ignoreReturnCode: true,
  }).catch(err => {
    console.warn('ESCAPED');
    console.warn('*********');
    console.warn('*********');
    console.log(err);
    console.log('typoeof :', typeof err);
    console.log('prototype of:', Object.getPrototypeOf(err));
    console.warn('*********');
    console.warn('*********');
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  process.on('uncaughtException', (reason, promise) => {
    console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const { stdout } = await getExecOutput(
    `node -p "require('${SUMMARY_PATH}').publishedPackages"`,
  ).catch(() => ({ stdout: undefined }));

  const result: Output[] | undefined = !stdout
    ? undefined
    : JSON.parse(stdout);

  return {
    result,
    inputs,
  };
};
