var http = require('http');

/* ================================================== */
/** Base Configuration Variables */
/* ================================================== */

var configFileDir = '../../../config/';
var fileExtension = '.json';
var requestValue = 'GET';

/* ================================================== */


/* ================================================== */
/** Environment Configuration Variables */
/* ================================================== */

var configEnvFileName = 'env';
var envFileFull = configEnvFileName + fileExtension;
var configEnvFilePath = configFileDir + envFileFull;

/* ================================================== */


/* ================================================== */
/**
 *
 * Load JSON configuration data from the sercer using
 * GET HTTP request
 *
 */
/* ================================================== */

var requestEnv = new XMLHttpRequest();

requestEnv.open(requestValue, configEnvFilePath, false);
requestEnv.send(null);

var configEnvObject = JSON.parse(requestEnv.responseText);
var configFileName = configEnvObject.environment;

/* ================================================== */
/* ================================================== */
/* ================================================== */


/* ================================================== */
/** Main Configuration Variables */
/* ================================================== */

var fileFull = configFileName + fileExtension;
var configFilePath = configFileDir + fileFull;

/* ================================================== */


/* ================================================== */
/**
 *
 * Load JSON configuration data from the sercer using
 * GET HTTP request
 *
 */
/* ================================================== */

var request = new XMLHttpRequest();

request.open(requestValue, configFilePath, false);
request.send(null);

var configObject = JSON.parse(request.responseText);
var mainServerValue = configObject.mainServer;
var portValue = mainServerValue[0].port;

/* ================================================== */
/* ================================================== */
/* ================================================== */

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('HTTP Request: OK');
});
server.listen(portValue);
