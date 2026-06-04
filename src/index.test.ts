import { describe, expect, test } from 'vitest';
import {
  constructComand,
  getPublishedsCommand,
  getVersionCommand,
} from './index';
import type { InputsSommand } from './types';

describe('pnpm-publish exports', () => {
  const baseInputs: InputsSommand = {
    access: '',
    tag: '',
    publishBranch: '',
    filter: '',
    dry_run: false,
    provenance: false,
    force: false,
  };

  test('#01 => getVersionCommand without filter returns default node command', () => {
    expect(getVersionCommand()).toBe(
      "node -p require('./package.json').version",
    );
  });

  test('#02 => getVersionCommand with filter returns node command with filter path', () => {
    expect(getVersionCommand('packages/foo')).toBe(
      "node -p require('packages/foo/package.json').version",
    );
  });

  test('#03 => getPublishedsCommand without summaryPath returns command with default path', () => {
    expect(getPublishedsCommand()).toBe(
      "node -p require('./pnpm-publish-summary.json').publishedPackages",
    );
  });

  test('#04 => getPublishedsCommand with summaryPath returns command with custom path', () => {
    expect(getPublishedsCommand('custom.json')).toBe(
      "node -p require('custom.json').publishedPackages",
    );
  });

  test('#05 => constructComand with base inputs returns base command array', () => {
    expect(constructComand(baseInputs)).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#06 => constructComand access option uses public access by default when empty', () => {
    expect(constructComand({ ...baseInputs, access: '' })).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#07 => constructComand access option uses provided access value', () => {
    expect(
      constructComand({ ...baseInputs, access: 'restricted' }),
    ).toEqual([
      'pnpm',
      'publish',
      '--access',
      'restricted',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#08 => constructComand tag option includes tag option when provided', () => {
    expect(constructComand({ ...baseInputs, tag: 'next' })).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--tag',
      'next',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#09 => constructComand dry_run option includes dry-run option when true', () => {
    expect(constructComand({ ...baseInputs, dry_run: true })).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--dry-run',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#10 => constructComand filter option includes filter option when provided', () => {
    expect(
      constructComand({ ...baseInputs, filter: 'packages/foo' }),
    ).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--filter',
      'packages/foo',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#11 => constructComand force option includes force option when true', () => {
    expect(constructComand({ ...baseInputs, force: true })).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--force',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#12 => constructComand provenance option includes provenance option when true', () => {
    expect(constructComand({ ...baseInputs, provenance: true })).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--provenance',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });

  test('#13 => constructComand publishBranch option includes publish-branch option when provided', () => {
    expect(
      constructComand({ ...baseInputs, publishBranch: 'main' }),
    ).toEqual([
      'pnpm',
      'publish',
      '--access',
      'public',
      '--publish-branch',
      'main',
      '--report-summary',
      '--no-git-checks',
      '--ignore-scripts',
    ]);
  });
});
