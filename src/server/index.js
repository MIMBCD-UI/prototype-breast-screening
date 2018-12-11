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
/** Base Configuration Variables                      */
/* ================================================== */

// Variables to use
var configFilePrefix = '';
var returnBackPath = '..';
var configFileSuffix = '/';
var srcFileName = 'src';
var configFileName = 'config';
var credentialsFileNamePath = 'credentials';
var usersNamePath = 'users';
var commonNamePath = 'common';
var studiesNamePath = 'studies';
var studyListName = 'studyList';
var covPatientIdName = 'cov_[patientID]';
var fileExtension = '.json';
var requestValue = 'GET';

// Variables name combinations
var usersFileName = usersNamePath + fileExtension;
var studyListFileName = studyListName + fileExtension;
var covPatientIdFileName = covPatientIdName + fileExtension;

// Acronym normal variables
var cfp = configFilePrefix;
var rbp = returnBackPath;
var cfs = configFileSuffix;
var unp = usersNamePath;
var ufn = usersFileName;
var sfn = srcFileName;
var cnp = commonNamePath;
var snp = studiesNamePath;

// Acronym name variables
var cfnp = credentialsFileNamePath;
var cpfn = covPatientIdFileName;
var slfn = studyListFileName;

// Join Configuration folder names
configFileNameSuffixJoin = path.join(configFileName, configFilePrefix);
configFilePrefixSetJoin = path.join(configFilePrefix, configFileName);

// Join Credentials folder names
credentialsJoin = path.join(rbp, cfnp);
usersFolderJoin = path.join(credentialsJoin, unp);
usersFileJoin = path.join(usersFolderJoin, ufn);

// Join Common folder names
srcCommonJoin = path.join(sfn, cnp);
studyListJoin = path.join(srcCommonJoin, slfn);
seriesListJoin = path.join(srcCommonJoin, studiesNamePath, cfs);
patientDataJoin = path.join(srcCommonJoin, cpfn);


// Variable paths
var configFileSet = configFileNameSuffixJoin;
var configFileDir = configFilePrefixSetJoin;
var studyListPath = studyListJoin;
var seriesPath = seriesListJoin;
var patientDataPath = patientDataJoin;
var usersDataPath = usersFileJoin;

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
var saveFileHandler = function(path, data, dataType) {
  var dataToSave = JSON.parse(data);
  var filePath = datasetFilePath + path;
  if(fs.existsSync(filePath))
  {
    var currentFile = fs.readFileSync(filePath);
    var currentData = JSON.parse(currentFile);
    switch(dataType)
    {
      case 'rawData':{
        currentData.rawData = dataToSave.rawData;
      }
      break;
      case 'patientdata':{
        currentData.patientdata = dataToSave.patientdata;
      }
      break;
      case 'birads':{
        if(currentData.birads != undefined && currentData.birads.length > 0)
        {
          var checkAlreadyExist = false;
          for(var i= 0; i< currentData.birads.length; i++)
          {
            if(currentData.birads[i].ImageId == dataToSave.birads[0].ImageId)
            {
              currentData.birads[i].birads = dataToSave.birads[0].birads;
              checkAlreadyExist = true;
            }
          }
          if(!checkAlreadyExist)
          {
            currentData.birads.push(dataToSave.birads[0]);
          }
        }
        else{
          currentData.birads = [];
          currentData.birads.push(dataToSave.birads[0]);
        }
      }
      break;
    }
    SaveFile(filePath, currentData);
  }
  else{
    SaveFile(filePath, dataToSave);
  }
};

function SaveFile(filePath, fileData){
  fs.writeFile(filePath, JSON.stringify(fileData, null, 4), function(err) {
    if (err) {
      console.log('Error in saving file :' + err);
    } else {
      console.log('file saved!');
    }
  });
}



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

    fs.writeFile(seriesPath + objectData.file[i].fileName + '.json', JSON.stringify(objectData.file[i].fileData, null, 4), function(err) {
      if (err) {
        console.log('Error in saving file:\n' + err);
      }
      console.log('patients file created successfully:');
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
var app = http.createServer(function(request, response) {

  if (request.url == 'SaveFile' || request.url == '/SaveFile' || request.url == './SaveFile') {
    var store = '';
    request.on('data', function(chunk) {
      store += chunk;
    });

    request.on('end', function() {
      var objectData = JSON.parse(store);
      saveFileHandler(objectData.path, store, 'rawData');
    });
    response.end('success');
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
  /* *************************************************************************************************/
  /* datasavefile _ test */
  if (request.url == 'datasavefile' || request.url == '/datasavefile' || request.url == './datasavefile') {

    var store = '';
    request.on('data', function(chunk) {
      store += chunk;
    });

    request.on('end', function() {
      var objectData = JSON.parse(store);
      saveFileHandler(objectData.path, store, 'patientdata');
    });
    response.end('success');
  }

  if (request.url == 'datasavefileBirads' || request.url == '/datasavefileBirads' || request.url == './datasavefileBirads') {

    var store = '';
    request.on('data', function(chunk) {
      store += chunk;
    });

    request.on('end', function() {
      var objectData = JSON.parse(store);
      saveFileHandler(objectData.path, store, 'birads');
    });
    response.end('success');
  }
  /* *************************************************************************************************/
  /* get_patient_info _ test */
  if (request.url == 'get_patient_info' || request.url == '/get_patient_info' || request.url == './get_patient_info') {
    response.end('success');
    // var store = '';
    // request.on('data', function(chunk) {
    //   store += chunk;
    //   console.log(store);
    // });
    // request.on('end', function() {
    //   fs.readFile(datasetFilePath+"a.json", function(error, content) {
    //     response.end(content, 'utf-8');
    //   });
    // });

  }


  /*************************************************************************************************** */
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
  if(extname != null)
  {
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
  }


  // fetchImage.fetchImagePatients(urlLinkDicomValue);

  if (request.url == 'ValidateUser' || request.url == '/ValidateUser' || request.url == './ValidateUser') {
    var store = '';
    request.on('data', function(chunk) {
      store += chunk;
    });

    request.on('end', function() {
      var loginResult = 'fail';
      var userData = JSON.parse(store);
      var stream = fs.readFileSync(usersDataPath);

      var data = JSON.parse(stream);
      var user = data.Users.User;
      for(var x = 0; x <user.length; x++)
      {
        if(user[x].Username == userData.username && user[x].Password == userData.password)
        {
          console.log('login success');
          loginResult = 'success';
         }
      }
      if(loginResult == 'fail')
      {
        console.log('login failure for '+ userData.username + ' with password ' + userData.password);
      }
      response.end(loginResult);
    });
  }



}).listen(portValue);

