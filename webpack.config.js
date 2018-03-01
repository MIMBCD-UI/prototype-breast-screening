 var path = require('path');
 var webpack = require('webpack');

module.exports = {
  entry: ["./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dev.bundle.js'
  },
  watch: true,
  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.es6']
  }
}
