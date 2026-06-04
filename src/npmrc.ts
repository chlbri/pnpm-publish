import { existsSync, readFileSync, writeFileSync } from 'fs';

const NPM_REGISTRY = 'https://registry.npmjs.org/';
const GITHUB_REGISTRY = 'https://npm.pkg.github.com/';

export type CreateNpmrcOptions = {
  authToken?: string;
  registry?: string;
};

const normalizeRegistry = (registry: string) => {
  const value = registry.trim().toLowerCase();

  if (value.length === 0 || value === 'npm') {
    return NPM_REGISTRY;
  }

  if (value === 'github') {
    return GITHUB_REGISTRY;
  }

  const withProtocol =
    value.startsWith('http://') || value.startsWith('https://')
      ? value
      : `https://${value}`;

  return withProtocol.endsWith('/') ? withProtocol : `${withProtocol}/`;
};

const registryHost = (registry: string) => {
  const normalized = normalizeRegistry(registry);
  const noProtocol = normalized.replace(/^https?:\/\//, '');
  const host = noProtocol.split('/')[0];
  return host;
};

type Out = Partial<{
  created: boolean;
  filePath: string;
  registry: string;
}>;

export const createNpmrc = (options: CreateNpmrcOptions = {}): Out => {
  if (!options.authToken) {
    return {
      created: false,
    };
  }

  const registry = normalizeRegistry(options.registry ?? 'npm');
  const authToken = (options.authToken ?? '${GITHUB_TOKEN}').trim();
  const filePath = '.npmrc';
  const host = registryHost(registry);
  const registryLine = `registry=${registry}`;
  const tokenLine = `//${host}/:_authToken=${authToken}`;
  const alreadyExists = existsSync(filePath);
  const previous = alreadyExists ? readFileSync(filePath, 'utf8') : '';

  const lines = previous
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  const hasRegistry = lines.some(line => line.startsWith('registry='));

  const hasTokenForHost = lines.find(line =>
    line.startsWith(`//${host}/:_authToken=`),
  );

  if (!hasRegistry) {
    lines.push(registryLine);
  }

  if (!hasTokenForHost) {
    lines.push(tokenLine);
  }

  const next = `${lines.join('\n')}\n`;
  writeFileSync(filePath, next, 'utf8');

  return {
    created: !alreadyExists,
    filePath,
    registry,
  };
};
