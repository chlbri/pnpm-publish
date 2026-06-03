import { exec as _exec, getExecOutput } from '@actions/exec';
import {} from '@actions/core';
import { buildCommand } from './commands';
import { createNpmrc } from './npmrc';
import type { Output } from './types';
import { SUMMARY_PATH } from './constants';
import type { ProcessEventMap } from 'process';

type RejectionHandler = (
  ...args: ProcessEventMap['unhandledRejection']
) => void;

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

  const handler: RejectionHandler = reason => {
    console.warn('Unhandled Rejection by reason:', reason);
  };

  process.on('unhandledRejection', handler);
  process.on('uncaughtException', handler);

  const { stdout } = await getExecOutput(
    `node -p "require('${SUMMARY_PATH}').publishedPackages"`,
    [],
    {
      silent: true,
      ignoreReturnCode: true,
    },
  ).catch(() => ({ stdout: undefined }));

  const result: Output[] | undefined = !stdout
    ? undefined
    : JSON.parse(stdout);

  process.off('unhandledRejection', handler);
  process.off('uncaughtException', handler);

  return {
    result,
    inputs,
  };
};
