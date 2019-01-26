const path = require('path');

module.exports = {
  configureWebpack:{
    module: {
      rules: [
        {
          // Need to be distinct from pug.
          test: /\.gpug$/,
          exclude: /node_modules/,
          // Always chain in this order
          use: [
            'vue-loader',
            'gosper-loader',
          ],
        },
      ],
    },
    // This part is just for path resolution.
    // You don't need it with a normal `npm install gosper-loader`
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, '..')
      ],
    }, 
  },
};
