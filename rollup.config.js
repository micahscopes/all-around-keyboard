import resolve from '@rollup/plugin-node-resolve';
import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';

const shared = {
  input: 'src/main.js',
  plugins: [
    string({ include: '**/*.css' }),
    resolve({ browser: true })
  ]
};

export default [
  {
    ...shared,
    output: {
      file: 'dist/all-around-keyboard.js',
      format: 'iife',
      name: 'AllAroundKeyboard'
    }
  },
  {
    ...shared,
    output: {
      file: 'dist/all-around-keyboard.min.js',
      format: 'iife',
      name: 'AllAroundKeyboard'
    },
    plugins: [...shared.plugins, terser()]
  },
  {
    ...shared,
    output: {
      file: 'dist/all-around-keyboard.esm.js',
      format: 'es'
    }
  },
  {
    ...shared,
    output: {
      file: 'dist/all-around-keyboard.esm.min.js',
      format: 'es'
    },
    plugins: [...shared.plugins, terser()]
  }
];
