// Rollup plugins
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import string from 'rollup-plugin-string';

export default {
  entry: 'src/main.js',
  acorn: {
    allowReserved: true
  },
  dest: 'dist/all-around-keyboard.js',
  format: 'iife',
  moduleName: "window",
  // sourceMap: 'inline',
  plugins: [
    string({include: '**/*.css'}),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: true  // Default: true
    }),
    commonjs({
      exclude: 'node_modules/skatejs/**'
    }),
    babel({
      presets: [
      ["env", {modules: false}],
      // ["es2016"]
      ],
      plugins: [
        'transform-class-properties',
        'transform-es2015-destructuring',
        'external-helpers',
      ],
      exclude: 'node_modules/babel-runtime/**',
    }),
  ],
};
