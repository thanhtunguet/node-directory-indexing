const path = require('path');
const nameof = require('ts-nameof');
const webpackNodeExternals = require('webpack-node-externals');
const sourceMapSupport = require('webpack-source-map-support');

const {NODE_ENV = 'development'} = process.env;

module.exports = {
  mode: NODE_ENV,
  entry: {
    index: path.resolve(__dirname, 'src', 'index.ts')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.node',
    ],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              getCustomTransformers() {
                return {
                  before: [
                    nameof,
                  ],
                };
              },
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  target: 'node',
  externals: [
    new webpackNodeExternals(),
  ],
  plugins: [
    new sourceMapSupport(),
  ]
}
