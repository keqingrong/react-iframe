import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { author, name, version } from './package.json';

const banner = `/** @license ${name} v${version}
 * Copyright (c) 2018-present, ${author}
 * Released under the MIT license
 */`;
const globalName = 'IframeUtils';
const configs = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/iframe-utils.esm.js',
      format: 'es',
      sourcemap: true,
      banner: banner,
    },
    external: ['is-same-origin'],
    plugins: [
      nodeResolve({
        module: true,
        jsnext: true,
        main: true,
        extensions: ['.js', '.json'],
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/iframe-utils.js',
      name: globalName,
      format: 'umd',
      sourcemap: true,
      banner: banner,
    },
    plugins: [
      nodeResolve({
        module: true,
        jsnext: true,
        main: true,
        extensions: ['.js', '.json'],
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: true,
      banner: banner,
      intro: "var { URL } = require('url');",
    },
    external: ['url', 'is-same-origin'],
    plugins: [
      nodeResolve({
        main: true,
        extensions: ['.js', '.json'],
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
];

export default configs;
