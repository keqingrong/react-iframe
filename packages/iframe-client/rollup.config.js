import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { author, name, version } from './package.json';

const banner = `/** @license ${name} v${version}
 * Copyright (c) 2018-present, ${author}
 * Released under the MIT license
 */`;
const globalName = 'IframeClient';
const configs = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/iframe-client.js',
      name: globalName,
      format: 'umd',
      banner: banner,
    },
    plugins: [
      nodeResolve({
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
];

export default configs;
