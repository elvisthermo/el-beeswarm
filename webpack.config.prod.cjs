const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const commonConfig = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    entry: './index.js',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      minimize: true,
    },
  };

  const cjsConfig = {
    ...commonConfig,
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist', 'cjs'),
      filename: 'el_beeswarm.min.js',
      library: 'vis',
      libraryTarget: 'umd',
    },
  };

  const esmConfig = {
    ...commonConfig,
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist', 'esm'),
      filename: 'el_beeswarm.min.js',
      libraryTarget: 'module',
    },
    experiments: {
      outputModule: true,
    },
  };

  return [cjsConfig, esmConfig];
};
