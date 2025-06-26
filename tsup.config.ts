import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/lib/dexie/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom', 'next', 'dexie', 'dexie-react-hooks', 'uuid'],
  tsconfig: './tsconfig.build.json'
}) 