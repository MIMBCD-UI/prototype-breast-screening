// In your server.js/index.js , run following code.

var updateAll = require('npm-update-all');
var json = require('./package.json');


updateAll(json);
