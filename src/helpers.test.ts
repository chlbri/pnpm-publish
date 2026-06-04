import { beforeEach, describe, expect, test, vi } from 'vitest';
import { safeExec } from './helpers';
import * as v from 'valibot';
import { exec } from '@actions/exec';

vi.mock('@actions/exec', () => ({
  exec: vi.fn(),
}));

describe('safeExec tests', () => {
  beforeEach(() => {
    vi.mocked(exec).mockReset();
  });

  test('#01 => safeExec without schema returns warnings and errors', async () => {
    vi.mocked(exec).mockImplementation(async (_, __, options) => {
      options?.listeners?.stdline?.('line 1');
      options?.listeners?.stdline?.('line 2');
      options?.listeners?.errline?.('error 1');
      return 0;
    });

    const res = await safeExec('some command');
    expect(res).toEqual({
      warnings: ['line 1', 'line 2'],
      errors: ['error 1'],
    });
  });

  test('#02 => safeExec with schema and valid output returns parsed result', async () => {
    vi.mocked(exec).mockImplementation(async (_, __, options) => {
      options?.listeners?.stdline?.(
        '{"name": "test", "version": "1.0.0"}',
      );
      return 0;
    });

    const schema = v.pipe(
      v.string(),
      v.parseJson(),
      v.object({
        name: v.string(),
        version: v.string(),
      }),
    );

    const res = await safeExec('some command', schema);
    expect(res).toEqual({
      errors: {
        stderr: [],
        schema: [],
      },
      result: {
        name: 'test',
        version: '1.0.0',
      },
    });
  });

  test('#03 => safeExec with schema and invalid output returns undefined result and errors', async () => {
    vi.mocked(exec).mockImplementation(async (_, __, options) => {
      options?.listeners?.stdline?.('invalid json');
      options?.listeners?.errline?.('std err output');
      return 1;
    });

    const schema = v.pipe(
      v.string(),
      v.parseJson({}, 'Invalid JSON format'),
      v.object({
        name: v.string(),
        version: v.string(),
      }),
    );

    const res = await safeExec('some command', schema);
    expect(res).toEqual({
      errors: {
        stderr: ['std err output'],
        schema: ['Invalid JSON format'],
      },
      result: undefined,
    });
  });
});
