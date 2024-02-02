const path = require('path');

module.exports = {
  entry: './src/flx.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'flx.min.js',
    path: path.resolve(__dirname, 'public'),
    iife: false,
    libraryTarget: 'var',
    library: 'flx_ts',
  },
  mode: "production",
};