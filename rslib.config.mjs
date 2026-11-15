import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [{ format: 'esm', bundle: false, dts: true, syntax: 'es2022' }],
  output: { target: 'web' },
});
