import resolve from '@rollup/plugin-node-resolve';
import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';

const input = 'src/main.js';
const plugins = (minify = false) => [
  string({ include: '**/*.css' }),
  resolve({ browser: true }),
  ...(minify ? [terser()] : [])
];

// Realpath resolution can otherwise leak a package manager's cache or staging
// directory into source maps. Keep dependency paths stable across machines.
const sourcemapPathTransform = sourcePath => {
  const normalized = sourcePath.replaceAll('\\', '/');
  const marker = '/node_modules/';
  const dependencyIndex = normalized.lastIndexOf(marker);
  return dependencyIndex < 0
    ? normalized
    : `../node_modules/${normalized.slice(dependencyIndex + marker.length)}`;
};

export default [
  {
    input,
    plugins: plugins(),
    output: {
      file: 'dist/all-around-keyboard.js',
      format: 'iife',
      name: 'AllAroundKeyboard',
      sourcemap: true,
      sourcemapPathTransform
    }
  },
  {
    input,
    plugins: plugins(true),
    output: {
      file: 'dist/all-around-keyboard.min.js',
      format: 'iife',
      name: 'AllAroundKeyboard',
      sourcemap: true,
      sourcemapPathTransform
    }
  },
  {
    input,
    plugins: plugins(),
    output: {
      file: 'dist/all-around-keyboard.esm.js',
      format: 'es',
      sourcemap: true,
      sourcemapPathTransform
    }
  },
  {
    input,
    plugins: plugins(true),
    output: {
      file: 'dist/all-around-keyboard.esm.min.js',
      format: 'es',
      sourcemap: true,
      sourcemapPathTransform
    }
  }
];
