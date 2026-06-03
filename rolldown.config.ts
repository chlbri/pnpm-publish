import { PLUGIN_BUILDERS } from '@bemedev/dev-utils/rolldown';
import { defineConfig } from 'rolldown';
import { esmExternalRequirePlugin } from 'rolldown/plugins';

export default defineConfig({
  input: 'src/action.ts',
  // external,
  output: {
    file: 'lib/action.js',
    format: 'esm',
    sourcemap: true,
  },
  platform: 'node',
  plugins: [
    PLUGIN_BUILDERS.alias(),
    PLUGIN_BUILDERS.tsPaths({ colors: true }),
    PLUGIN_BUILDERS.externals({
      deps: false,
      peerDeps: false,
      optDeps: false,
    }),
    esmExternalRequirePlugin(),
    PLUGIN_BUILDERS.typescript({ dir: 'lib' }),
  ],
});
