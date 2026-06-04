import { exec } from '@actions/exec';
import { BaseIssue, BaseSchema, safeParse } from 'valibot';
import { NPM_WARNINGS } from './constants';

export async function safeExec<
  I = any,
  O = any,
  E extends BaseIssue<unknown> = BaseIssue<unknown>,
>(
  command: string,
  schema: BaseSchema<I, O, E>,
): Promise<{
  errors: { stderr: string[]; schema: string[] };
  result?: O;
}>;

export async function safeExec(
  command: string,
): Promise<{ warnings: string[]; errors: string[] }>;

export async function safeExec(
  command: string,
  schema?: BaseSchema<any, any, any>,
): Promise<
  | { errors: { stderr: string[]; schema: string[] }; result?: any }
  | { warnings: string[]; errors: string[] }
> {
  const warnings: string[] = [];
  const errors: string[] = [];

  await exec(command, [], {
    silent: true,
    ignoreReturnCode: true,
    listeners: {
      stdline: data => warnings.push(data),
      errline: data => errors.push(data),
    },
  });

  if (schema) {
    const json = warnings.join('\n');
    console.log('before pass', json);
    const parsed = safeParse(schema, json);
    console.log('after pass', parsed);

    if (parsed.success) {
      return {
        errors: {
          stderr: errors,
          schema: [],
        },
        result: parsed.output,
      };
    } else {
      const schema = parsed.issues.map(issue => issue.message);

      return {
        errors: {
          stderr: errors,
          schema,
        },
      };
    }
  }

  return {
    warnings,
    errors,
  };
}

export const collectNpmCodes = (...warnings: string[]) => {
  const _warnings: string[] = [];
  const npms = Object.entries(NPM_WARNINGS);
  warnings.forEach(warn => {
    npms.forEach(([code, messages]) => {
      messages.forEach(message => {
        if (warn.includes(message)) _warnings.push(code);
      });
    });
  });

  _warnings.forEach(warnErrors('PNPM publish warns with codes'));

  if (_warnings.length > 0) return _warnings;
  else return undefined;
};

export const warnErrors = (label: string) => {
  return (error: string, index: number, errors: string[]) => {
    if (index === 0) {
      console.warn('-'.repeat(60));
      console.warn(label, 'ERRORS');
      console.warn('-'.repeat(60));
      console.warn();
    }

    console.warn(index + 1, ':=>', error);

    if (index === errors.length - 1) {
      console.warn();
      console.warn('-'.repeat(60));
      console.warn('END OF', label, 'ERRORS');
      console.warn();
      console.warn();
    }
  };
};
