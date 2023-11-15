const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const config = {
    target: 'node',
    entry: './index.ts',
    plugins: [
      new CleanWebpackPlugin(),
      new EslintPlugin({ extensions: ['ts', 'js'] }),
    ],
    devtool: isProduction ? false : 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    devServer: {
      static: './dist',
      historyApiFallback: true,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
        },
        {
          test: /\.json$/i,
          loader: 'json5-loader',
          type: 'javascript/auto',
        }
      ]
    },
    optimization: {
      runtimeChunk: 'single',
    },
    mode: isProduction ? 'production' : 'development',
    resolve: {
      fallback: {
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      },
      extensions: ['.ts', '.js', '.json'],
    },
    externals: {
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    }
  };
  return config;
};
