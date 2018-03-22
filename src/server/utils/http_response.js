var http = require('http');
var fs = require("fs");

/* ================================================== */
/** Base Configuration Variables */
/* ================================================== */

var configFilePrefix = '../../../';
var configFileName = 'config';
var configFileSuffix = '/';
var configFileSet = configFileName + configFileSuffix;
var configFileDir = configFilePrefix + configFileSet;
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

var readEnvConfigPath = fs.readFileSync(configEnvFilePath, 'utf8');
var configEnvObject = JSON.parse(readEnvConfigPath);
var configFileName = configEnvObject.environment;

console.log("Response Read Env Config Path:\n", readEnvConfigPath);
console.log("Response Config Env Object:\n", configEnvObject);
console.log("Response Config File Name:\n", configFileName);

/* ================================================== */
/* ================================================== */
/* ================================================== */


/* ================================================== */
/** Main Configuration Variables */
/* ================================================== */

var fileFull = configFileName + fileExtension;
var configFilePath = configFileSet + fileFull;

/* ================================================== */


/* ================================================== */
/**
 *
 * Load JSON configuration data from the sercer using
 * GET HTTP request
 *
 */
/* ================================================== */

var readConfigPath = fs.readFileSync(configFilePath, 'utf8');
var configObject = JSON.parse(readConfigPath);
var mainServerValue = configObject.mainServer;
var portValue = mainServerValue[0].port;

console.log("Response Read Config Path:\n", readConfigPath);
console.log("Response Config Object:\n", configObject);
console.log("Response Main Server Value:\n", mainServerValue);
console.log("Response Port Value:\n", portValue);

/* ================================================== */
/* ================================================== */
/* ================================================== */

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('HTTP Request: OK');
});
server.listen(portValue);
