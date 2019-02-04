/**
 * @file The main file and entry point for the Breast Screening
 *       Prototype repository.
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 * @exports server
 */

/* ================================================== */
/** IMPORT Node Modules                               */
/* ================================================== */

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

/* ================================================== */


/* ================================================== */
/** IMPORT Utils                                      */
/* ================================================== */

var requests = require("./utils/requests");
// var fetchImage = require("./utils/fetchImage");

/**
 *
 */

var updateAll = require("./utils/npm-update-all");

/* ================================================== */

/* ================================================== */
/** Base Declarable String Variables                  */
/* ================================================== */

var s001 = 'SaveFile';
var s002 = '/SaveFile';
var s003 = './SaveFile';
var s004 = 'UpdatePatients';
var s005 = '/UpdatePatients';
var s006 = './UpdatePatients';
var s007 = 'UpdatePatientFile';
var s008 = '/UpdatePatientFile';
var s009 = './UpdatePatientFile';
var s010 = '';
var s011 = 'data';
var s012 = 'end';
var s013 = 'success';
var s014 = 'update patients';
var s015 = ' ';
var s016 = 'files in studies/<file>';
var s017 = 'Content-Type';
var s018 = 'text/plain';
var s019 = '.';
var s020 = './';
var s021 = '../public/index.html';
var s022 = 'text/html';
var s023 = '.js';
var s024 = 'text/javascript';
var s025 = '.css';
var s026 = '.json';
var s027 = 'text/css';
var s028 = 'application/json';
var s029 = '.png';
var s030 = 'image/png';
var s031 = '.jpg';
var s032 = 'image/jpg';
var s033 = '.wav';
var s034 = 'audio/wav';
var s035 = 'ENOENT';
var s036 = '../public/404.html';
var s037 = 'utf-8';
var s038 = 'Sorry, check with the site admin for error: ';
var s039 = ' ..\n';

/* ================================================== */


/* ================================================== */
/** Base Configuration Variables                      */
/* ================================================== */

// var configFilePrefix = '../../';
var configFilePrefix = s010;
var configFileName = 'config';
var configFileSuffix = '/';
var configFileSet = configFileName + configFileSuffix;
var configFileDir = configFilePrefix + configFileSet;
var fileExtension = s026;
var requestValue = 'GET';
var studyListPath = 'src/common/studyList.json';
var seriesPath = 'src/common/studies/';
var seriesMetadataPath = '../' + 'dataset-patients-metadata/dataset/';

/* ================================================== */


/* ================================================== */
/** Dataset File Path Manager                         */
/* ================================================== */

var configFileValue = requests.getConfigFileValue();

if (configFileValue === "prod") {
  var datasetFilePath = '../dataset-annotations/dataset/';
} else if (configFileValue === "test") {
  var datasetFilePath = 'dataset/';
} else if (configFileValue === "stage") {
  var datasetFilePath = 'dataset/';
} else if (configFileValue === "integration") {
  var datasetFilePath = 'dataset/';
} else if (configFileValue === "internal") {
  var datasetFilePath = 'dataset/';
} else if (configFileValue === "dev") {
  var datasetFilePath = 'dataset/';
} else {
  var datasetFilePath = 'dataset/';
}

/* ================================================== */


/* ================================================== */
/**
 *
 * Load JSON configuration data from the sercer using
 * GET HTTP request
 *
 */
/* ================================================== */

var portValue = requests.getPortValue();
var urlLinkDicomValue = requests.getUrlLinkDicomValue();

/* ================================================== */
/* ================================================== */
/* ================================================== */

/**
 * @function
 * @name saveFileHandler
 * @static
 *
 * @desc This function aims to receive a `data` from a
 *       `path` to be parsed in.
 *
 * @param {string} path The path to the file.
 * @param {Object} data The data for being parsed.
 */
var saveFileHandler = function(path, data) {
  var fileData = JSON.parse(data);
  fs.writeFile(datasetFilePath + path, JSON.stringify(fileData, null, 4), function(err) {
    if (err) {
      console.log('Error in saving file :' + err);
    } else {
      console.log('file saved!');
    }
  });
};

/**
 * @function
 * @name updateStudiesHandler
 * @static
 *
 * @desc This function aims to receive a `patientData` to update the
 *       several studies by the use of a handler.
 *
 * @param {Object} patientData The patient data for being parsed.
 */
var updateStudiesHandler = function(patientData) {
  var studyList = JSON.parse(patientData)
  fs.writeFile(studyListPath, JSON.stringify(studyList, null, 4), function(err) {
    if (err) {
      console.log('Error in saving file ');
    }else{
    console.log('file studyList.json updated successfully saved!');
    }
  });
};

/**
 * @function
 * @name updateStudiesFileHandler
 * @static
 *
 * @desc This function aims to receive a `fileData` to update the
 *       several studies file.
 *
 * @param {Object} fileData The file data for being parsed.
 */
var updateStudiesFileHandler = function(fileData) {
  var objectData = JSON.parse(fileData);
  console.log(objectData.file.length);
  for (var i = 0; i < objectData.file.length; i++) {
    var spFileName = seriesPath + objectData.file[i].fileName + s026;
    var smpFileName = seriesMetadataPath + objectData.file[i].fileName + s026;
    var eachFileData = JSON.stringify(objectData.file[i].fileData, null, 4);
    fs.writeFile(spFileName, eachFileData, function(err) {
      if (err) {
        console.log('Error in saving file:\n' + err);
      }
      console.log('Patients file created successfully:');
    });
    fs.writeFile(smpFileName, eachFileData, function(err) {
      if (err) {
        console.log('Error for Patients Metadata in saving file:\n' + err);
      }
      console.log('Patients Metadata file created successfully:');
    });
  }
};

/**
 * @function
 * @global
 *
 * @desc Contains the server-side logic of our prototype. The server can
 *       read and consume the `studyList.json` list of DICOM image studies
 *       and the respective studies of each patient. At the end the server
 *       is serving an end-point from a specific port.
 *
 * @param {Object} request The server request over patients information.
 * @param {Object} response The answer of the server.
 */
http.createServer(function(request, response) {

  var rurl = request.url;

  if (rurl == s001 || rurl == s002 || rurl == s003) {
    var store = s010;
    request.on(s011, function(chunk) {
      store += chunk;
    });

    request.on(s012, function() {
      var objectData = JSON.parse(store);
      saveFileHandler(objectData.path, store);
    });
  };

  if (rurl == s004 || rurl == s005 || rurl == s006) {
    console.log(s014);
    var patientData = s010;
    request.on(s011, function(chunk) {
      patientData += chunk;
    });

    request.on(s012, function() {
      response.writeHead(200, {
        'Content-Type': s018
      });
      response.end(s013);
      updateStudiesHandler(patientData);
    });
  };

  if (rurl == s007 || rurl == s008 || rurl == s009) {
    console.log(s014 + s015 + s016);
    var fileData = s010;
    request.on(s011, function(chunk) {
      fileData += chunk;
    });

    request.on(s012, function() {
      response.writeHead(200, {
        'Content-Type': s018
      });
      response.end(s013);
      updateStudiesFileHandler(fileData);
    });
  };

  var filePath = s019 + rurl;
  if (filePath == s020) {
    filePath = s021;
  }

  var extname = path.extname(filePath);
  var contentType = s022;
  switch (extname) {
    case s023:
      contentType = s024;
      break;
    case s025:
      contentType = s027;
      break;
    case s026:
      contentType = s028;
      break;
    case s029:
      contentType = s030;
      break;
    case s031:
      contentType = s032;
      break;
    case s033:
      contentType = s034;
      break;
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      if (error.code == s035) {
        fs.readFile(s036, function(error, content) {
          response.writeHead(200, {
            'Content-Type': contentType
          });
          response.end(content, s037);
        });
      } else {
        response.writeHead(500);
        response.end(s038 + error.code + s039);
        response.end();
      }
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      response.end(content, s037);
    }
  });

}).listen(portValue);
