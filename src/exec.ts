import { exec as _exec, getExecOutput } from '@actions/exec';
import {} from '@actions/core';
import { buildCommand } from './commands';
import { createNpmrc } from './npmrc';
import type { Output } from './types';
import { SUMMARY_PATH } from './constants';
// import type { ProcessEventMap } from 'process';

// type RejectionHandler = (
//   ...args: ProcessEventMap['unhandledRejection']
// ) => void;

const cmdExec = async (command: string) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  await _exec(command, [], {
    silent: true,
    ignoreReturnCode: true,
    listeners: {
      errline: data => {
        errors.push(data);
      },
      stdline: data => {
        warnings.push(data);
      },
    },
  });

  console.log('Erreurs: ' + errors.join('\n'));
  console.log('Warnings: ' + warnings.join('\n'));

  return { errors, warnings };
};

export const exec = async () => {
  const { command, inputs } = buildCommand();

  createNpmrc({
    authToken: inputs.AUTH,
    registry: inputs.registry,
  });

  await cmdExec(command);

  // const handler: RejectionHandler = reason => {
  //   console.warn('Unhandled Rejection by reason:', reason);
  // };

  // process.on('unhandledRejection', handler);
  // process.on('uncaughtException', handler);

  const { stdout } = await getExecOutput(
    `node -p "require('${SUMMARY_PATH}').publishedPackages"`,
    [],
    {
      ignoreReturnCode: true,
    },
  ).catch(() => ({ stdout: undefined }));

  const result: Output[] | undefined = !stdout
    ? undefined
    : JSON.parse(stdout);

  return {
    result,
    inputs,
  };
};
