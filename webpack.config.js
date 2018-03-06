var path = require('path');
var webpack = require('webpack');

var serverConfig = {
  entry: ["./start.js"],
  target:'node',
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename : 'backend-node.js'
  }
};

var clientConfig = {
  entry: ["./src/js/index.js"],
  target:'web',
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename : 'main.bundle.js'
  },
  node:{
    'fs':'empty'
  }
};

module.exports = [clientConfig, serverConfig]
