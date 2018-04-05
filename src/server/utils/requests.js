/* ================================================== */
/** IMPORT Node Modules                               */
/* ================================================== */

var fs = require("fs");

/* ================================================== */


/* ================================================== */
/** Base Configuration Variables                      */
/* ================================================== */

var exports = module.exports = {};

// var configFilePrefix = '../../';
var configFilePrefix = '';
var configFileName = 'config';
var configFileSuffix = '/';
var configFileSet = configFileName + configFileSuffix;
var configFileDir = configFilePrefix + configFileSet;
var fileExtension = '.json';
var requestValue = 'GET';
var studyListPath = 'src/common/studyList.json';
var seriesPath = 'src/common/studies/';

/* ================================================== */


/* ================================================== */
/** Environment Configuration Variables               */
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

// console.log("Index Read Env Config Path:\n", readEnvConfigPath);
// console.log("Index Config Env Object:\n", configEnvObject);
// console.log("Index Config File Name:\n", configFileName);

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
var dicomServerValue = configObject.dicomServer;
var portDicomValue = dicomServerValue[0].port;
var mainServerValue = configObject.mainServer;
var portValue = mainServerValue[0].port;
var hostnameValue = mainServerValue[0].hostname;

// console.log("Index Read Config Path:\n", readConfigPath);
// console.log("Index Config Object:\n", configObject);
// console.log("Index Main Server Value:\n", mainServerValue);
// console.log("Index DICOM Server Port Value:\n", portDicomValue);
// console.log("Index Port Value:\n", portValue);

/* ================================================== */
/* ================================================== */
/* ================================================== */


/* ================================================== */
/** Getters                                           */
/* ================================================== */

exports.getConfigFileValue = function() {
  return configFileName;
}

exports.getPortValue = function() {
  return portValue;
}

exports.getHostnameValue = function() {
  return hostnameValue;
}

/* ================================================== */


/* ================================================== */
/** Module Exports                                    */
/* ================================================== */



/* ================================================== */
