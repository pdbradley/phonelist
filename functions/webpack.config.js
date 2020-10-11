'use strict';

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  context: path.resolve(__dirname, 'src'),

  entry: {
    login: ['./login.ts'],
  },

  externals: ['aws-sdk'],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
  },

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100,
  },

  devtool: NODE_ENV === 'development' ? 'source-map' : null,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  /*
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
    }),
  ],
  */

  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, '..', 'node_modules'),
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  target: 'node',

  optimization: {
    minimize: false,
  },
};

/*
if (NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // don't show unreachable variables etc
        warnings: false,
        drop_console: true,
        unsafe: true,
      },
    })
  );
}
*/
