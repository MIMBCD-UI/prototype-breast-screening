var path = require('path');
var webpack = require('webpack');

var serverConfig = {
  entry: ["./src/server/index.js"],
  target:'node',
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename : 'server.bundle.js'
  }
};

var clientConfig = {
  entry: ["./src/client/index.js"],
  target:'web',
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename : 'client.bundle.js'
  },
  node:{
    'fs':'empty'
  }
};

module.exports = [clientConfig, serverConfig]
