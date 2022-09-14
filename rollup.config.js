import pluginTypescript from '@rollup/plugin-typescript';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { babel as pluginBabel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser as pluginTerser } from 'rollup-plugin-terser';
import pluginPolyfill from 'rollup-plugin-polyfill-node';

import * as path from 'path';

const plugins = [
  getBabelOutputPlugin({
    allowAllFormats: true,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            ie: 11,
            edge: 16,
            chrome: 64,
            firefox: 58,
            safari: 11
          }
        }
      ]
    ]
  })
];

const __DEV__ = process.env.NODE_ENV === 'development';
!__DEV__ && (
  plugins.push(pluginTerser())
);

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/browser/index.js',
        exports: 'named',
        name: 'PromotedMapbox',
        format: 'iife',
        sourcemap: __DEV__ ? 'inline' : '',
        globals: {
          'mapbox-gl': 'mapboxgl'
        },
        plugins
      },
      {
        file: 'lib/commonjs/index.js',
        exports: 'named',
        name: 'PromotedMapbox',
        format: 'amd',
        sourcemap: __DEV__ ? 'inline' : '',
        plugins
      }
    ],
    plugins: [
      pluginTypescript({
        tsconfig: 'tsconfig.json',
        module: 'esnext',
      }),
      pluginNodeResolve({
        browser: true
      }),
      pluginCommonjs({
        extensions: ['.js', '.ts']
      }),
      pluginBabel({
        babelHelpers: 'bundled',
        configFile: path.resolve(__dirname, '.babelrc.js'),
        exclude: /node_modules/
      }),
      pluginPolyfill()
    ],
    external: [
      'mapbox-gl'
    ]
  }
];

export default config;
