const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve('lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(ts)?$/,
        use: ['ts-loader', 'eslint-loader'],
        exclude: '/node_modules/',
      },
    ],
  },
  resolve: {
    alias: {
      redux: path.resolve(__dirname, './node_modules/redux'),
      'redux-thunk': path.resolve(__dirname, './node_modules/redux-thunk'),
    },
    extensions: ['*', '.ts', '.tsx', '.js'],
  },
  plugins: [new CleanWebpackPlugin()],
  externals: {
    // Don't bundle redux
    react: {
      commonjs: 'redux',
      commonjs2: 'redux',
      amd: 'Redux',
      root: 'Redux',
    },
    'redux-thunk': {
      commonjs: 'redux-thunk',
      commonjs2: 'redux-thunk',
      amd: 'ReduxThunk',
      root: 'ReduxThunk',
    },
  },
};
