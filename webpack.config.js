const path = require('path');

module.exports = {
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.gosper\.js$/,
        exclude: /node_modules/,
        loader: 'gosper-loader',
        options: {},
      },
    ],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname)
    ],
  },
};
