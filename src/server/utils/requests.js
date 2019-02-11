/**
 * @file This file will have all requests variables and methods. Our
 *       requests are designed to be the simplest way possible to make
 *       calls. Several getters are available here.
 *
 * @exports utils/requests
 * @requires fs
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

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
var mainServerValue = configObject.mainServer;

var portValue = mainServerValue[0].port;
var hostnameValue = mainServerValue[0].hostname;

var portDicomValue = dicomServerValue[0].port;
var hostnameDicomValue = dicomServerValue[0].hostname;
var transferProtocolDicomValue = dicomServerValue[0].transferProtocol;
var prefixDicomValue = dicomServerValue[0].prefix;
var portEscapeDicomValue = dicomServerValue[0].portEscape;

var urlHeaderDicomValue = transferProtocolDicomValue + prefixDicomValue;
var urlPortSetDicomValue = portEscapeDicomValue + portDicomValue;
var urlBodyDicomValue = hostnameDicomValue + urlPortSetDicomValue;
var urlLinkDicomValue = urlHeaderDicomValue + urlBodyDicomValue;

/* ================================================== */
/* ================================================== */
/* ================================================== */


/* ================================================== */
/** Getters                                           */
/* ================================================== */

/**
 * @function
 * @name getConfigFileValue
 * @static
 *
 * @desc Getting our configuration file function.
 *
 * @returns {String} configFileName
 */
getConfigFileValue = function() {
  return configFileName;
}

/**
 * @function
 * @name getPortValue
 * @static
 *
 * @desc Getting our port function.
 *
 * @returns {number} portValue
 */
getPortValue = function() {
  return portValue;
}

/**
 * @function
 * @name getHostnameValue
 * @static
 *
 * @desc Getting our hostname function.
 *
 * @returns {string} hostnameValue
 */
getHostnameValue = function() {
  return hostnameValue;
}

/**
 * @function
 * @name getTransferProtocolValue
 * @static
 *
 * @desc Getting our transfer protocol function.
 *
 * @returns {string} transferProtocolDicomValue
 */
getTransferProtocolValue = function() {
  return transferProtocolDicomValue;
}

/**
 * @function
 * @name getPrefixDicomValue
 * @static
 *
 * @desc Getting our DICOM prefix function.
 *
 * @returns {string} prefixDicomValue
 */
getPrefixDicomValue = function() {
  return prefixDicomValue;
}

/**
 * @function
 * @name getPortEscapeDicomValue
 * @static
 *
 * @desc Getting our DICOM port escape function.
 *
 * @returns {string} portEscapeDicomValue
 */
getPortEscapeDicomValue = function() {
  return portEscapeDicomValue;
}

/**
 * @function
 * @name getUrlLinkDicomValue
 * @static
 *
 * @desc Getting our DICOM URL link function.
 *
 * @returns {string} urlLinkDicomValue
 */
getUrlLinkDicomValue = function() {
  return urlLinkDicomValue;
}

/* ================================================== */


/* ================================================== */
/** Module Exports                                    */
/* ================================================== */

exports.getConfigFileValue = getConfigFileValue;
exports.getPortValue = getPortValue;
exports.getHostnameValue = getHostnameValue;
exports.getTransferProtocolValue = getTransferProtocolValue;
exports.getPrefixDicomValue = getPrefixDicomValue;
exports.getPortEscapeDicomValue = getPortEscapeDicomValue;
exports.getUrlLinkDicomValue = getUrlLinkDicomValue;

/* ================================================== */
