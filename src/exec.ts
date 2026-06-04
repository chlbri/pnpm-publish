import { buildCommand, getPublishedsCommand } from './commands';
import { collectNpmCodes, safeExec, warnErrors } from './helpers';
import { createNpmrc } from './npmrc';
import { SchemaPublisheds } from './schemas';

const cmdExec = async (command: string) => {
  const result = await safeExec(command);
  const out = collectNpmCodes(...result.warnings);

  return out;
};

const cmdSummary = async () => {
  const { errors, result } = await safeExec(
    getPublishedsCommand(),
    SchemaPublisheds,
  );
  errors.schema.forEach(warnErrors('JSON SCHEMA validation'));

  return result;
};

export const exec = async () => {
  const { command, inputs } = buildCommand();

  createNpmrc({
    authToken: inputs.AUTH,
    registry: inputs.registry,
  });

  const resultCommand = await cmdExec(command);
  if (resultCommand) return { inputs, result: undefined };

  const result = await cmdSummary();

  return {
    result,
    inputs,
  };
};
