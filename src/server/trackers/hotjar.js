/**
 * @file This file contains our Hotjar Tracking Code manager. The file
 *       aims to track and manage the several server environments of
 *       the hereby project.
 *
 * @requires fs
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

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
var hotjarValue = mainServerValue[0].hotjar;
var hotjarNumber = Number(hotjarValue);

console.log("Hotjar Number:\n", hotjarNumber);

/* ================================================== */
/* ================================================== */
/* ================================================== */

/**
 * @function
 * @static
 *
 * @desc When we are actively recording visitors, the Hotjar Tracking
 *       script initiates a websocket connection which sends information
 *       to the Hotjar servers.
 *
 * URL: breastscreening.isr.tecnico.ulisboa.pt
 *
 * @param {Object} h Hotjar window post message.
 * @param {Object} o Document tags of HTML Header.
 * @param {string} t URL Link for the global Hotjar calls.
 * @param {string} j Hotjar JavaScript link query.
 * @param {Object} a Object with the full page header.
 * @param {Object} r Direct script import for the page.
 *
 */

console.log('Hotjar imported correctly...');

(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:hotjarNumber,hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
  console.log("Append Child:\n", a.appendChild(r));
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

console.log("Hotjar is running...");
