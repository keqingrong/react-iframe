import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { author, name, version } from '../package.json';

const banner = `/* @license ${name} v${version} | (c) 2018-present ${author} */`;
const globalName = 'ReactIframe';
const entries = ['index.js'];
const configs = [{
  input: 'src/index.js',
  output: {
    file: 'dist/react-iframe.js',
    name: globalName,
    format: 'umd',
    banner: banner,
    globals: {
      react: 'React',
      'prop-types': 'PropTypes'
    }
  },
  external: ['react', 'prop-types'],
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      extensions: ['.js', '.jsx', '.json']
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}];

export default configs;
