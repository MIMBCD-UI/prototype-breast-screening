var http = require('http');
var url = require("url");
var path = require("path");
var fs = require("fs");

/* ================================================== */
/** Base Configuration Variables */
/* ================================================== */

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

console.log("Index Read Env Config Path:\n", readEnvConfigPath);
console.log("Index Config Env Object:\n", configEnvObject);
console.log("Index Config File Name:\n", configFileName);

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

console.log("Index Read Config Path:\n", readConfigPath);
console.log("Index Config Object:\n", configObject);
console.log("Index Main Server Value:\n", mainServerValue);
console.log("Index Port Value:\n", portValue);

/* ================================================== */
/* ================================================== */
/* ================================================== */

var saveFileHandler = function(path, data) {
  fs.writeFile('dataset/' + path, data, function(err) {
    if (err) {
      console.log('Error in saving file ');
    }
    console.log('file saved!');
  });
};

var updateStudiesHandler = function(patientData) {
  var studyList = JSON.parse(patientData)
  fs.writeFile(studyListPath, JSON.stringify(studyList, null, 4), function(err) {
    if (err) {
      console.log('Error in saving file ');
    }
    console.log('file studyList.json updated successfully saved!');
  });
};

var updateStudiesFileHandler = function(fileData) {
  var objectData = JSON.parse(fileData);
  console.log(objectData.file.length);
  for (var i = 0; i < objectData.file.length; i++) {

    fs.writeFile(seriesPath + objectData.file[i].fileName + '.json', JSON.stringify(objectData.file[i].fileData, null, 4), function(err) {
      if (err) {
        console.log('Error in saving file:\n' + err);
      }
      console.log('patients file created successfully:');
    });
  }
};

http.createServer(function(request, response) {
  if (request.url == 'SaveFile' || request.url == '/SaveFile' || request.url == './SaveFile') {
    var store = '';
    request.on('data', function(chunk) {
      store += chunk;
    });

    request.on('end', function() {
      var objectData = JSON.parse(store);
      saveFileHandler(objectData.path, store);
      console.log(objectData.path);
    });
  };

  if (request.url == 'UpdatePatients' || request.url == '/UpdatePatients' || request.url == './UpdatePatients') {
    console.log('update patients');
    var patientData = '';
    request.on('data', function(chunk) {
      patientData += chunk;
    });

    request.on('end', function() {
      //console.log(patientData);
      response.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      response.end('success');
      updateStudiesHandler(patientData);
    });
  };

  if (request.url == 'UpdatePatientFile' || request.url == '/UpdatePatientFile' || request.url == './UpdatePatientFile') {
    console.log('update patients files in studies/<file>');
    var fileData = '';
    request.on('data', function(chunk) {
      fileData += chunk;
    });

    request.on('end', function() {
      //console.log(fileData);
      response.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      response.end('success');
      updateStudiesFileHandler(fileData);
    });
  };

  var filePath = '.' + request.url;
  if (filePath == './') {
    filePath = '../public/index.html';
  }

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      if (error.code == 'ENOENT') {
        fs.readFile('../public/404.html', function(error, content) {
          response.writeHead(200, {
            'Content-Type': contentType
          });
          response.end(content, 'utf-8');
        });
      } else {
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
        response.end();
      }
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      response.end(content, 'utf-8');
    }
  });
}).listen(portValue);
