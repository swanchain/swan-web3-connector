import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'SwanWalletConnector',
      globals: {
        ethers: 'ethers'
      }
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: ['ethers'],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: [
              'last 2 versions',
              'not dead',
              '> 0.2%'
            ]
          },
          modules: false
        }]
      ]
    })
  ]
}; 