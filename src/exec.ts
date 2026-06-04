import { exec as _exec } from '@actions/exec';
import { buildCommand } from './commands';
import { SUMMARY_PATH } from './constants';
import { createNpmrc } from './npmrc';
import type { Output } from './types';
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

  console.log('Erreurs: ', errors);
  console.log('Warnings: ', warnings);

  return { errors, warnings };
};

const cmdSummary = async () => {
  const errors: string[] = [];
  const warnings: string[] = [];
  await _exec(
    `node -p "require('${SUMMARY_PATH}').publishedPackages"`,
    [],
    {
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
    },
  );

  console.log('Erreurs: ', errors);
  console.log('Warnings: ', warnings);

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

  const { warnings } = await cmdSummary();

  const stdout = warnings.join('\n');

  const result: Output[] | undefined = !stdout
    ? undefined
    : JSON.parse(stdout);

  return {
    result,
    inputs,
  };
};
