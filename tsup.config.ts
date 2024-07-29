import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  shims: true,
  skipNodeModulesBundle: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  publicDir: true
});
