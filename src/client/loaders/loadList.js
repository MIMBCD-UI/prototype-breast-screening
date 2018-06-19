/**
 * @file This file aims to contain the several loading list methods. These
 *       methods are a group of gets, maps and updates of the list.
 *
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
var localDicomServerPath = 'http://localhost:8042/';

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
var dicomServerValue = configObject.dicomServer;
var protocolValue = dicomServerValue[0].transferProtocol;
var prefixValue = dicomServerValue[0].prefix;
var hostnameValue = dicomServerValue[0].hostname;
var portEscapeValue = dicomServerValue[0].portEscape;
var portValue = dicomServerValue[0].port;
var suffixValue = dicomServerValue[0].suffix;

var refStartValue = protocolValue + prefixValue;
var refEndValue = portEscapeValue + portValue + suffixValue;

var dicomServerPath = refStartValue + hostnameValue + refEndValue;

// console.log('Local DICOM Server Path:\n', localDicomServerPath);
// console.log('Current DICOM Server Path:\n', dicomServerPath);

/* ================================================== */
/* ================================================== */
/* ================================================== */


/* ================================================== */
/** Source Variable Definitions */
/* ================================================== */

var studyListData = [];
var studyList = {};
var studies = [];
var studiesDataStructure = {};
var patientList = {};
var studiesList = [];
var studiesObjectData = [];
var seriesList = [];
var seriesObjectData = [];
var instanceList = [];
var instanceObjectData = [];

/* ================================================== */


// console.log("Config File Path: ", configFilePath);


/* ================================================== */
/**
 *
 * Load JSON configuration data from the sercer using
 * GET HTTP request
 *
 */
/* ================================================== */

var patientsExpandedQuery = 'patients?expand';
var patientsDirPath = 'patients' + '/';
var studiesDirPath = 'studies' + '/';
var seriesDirPath = 'series' + '/';
var instancesDirPath = 'instances' + '/';

var patientsExpandedPath = dicomServerPath + patientsExpandedQuery;
var studiesPath = dicomServerPath + studiesDirPath;
var seriesPath = dicomServerPath + seriesDirPath;
var instancesPath = dicomServerPath + instancesDirPath;

/* ================================================== */
/* ================================================== */
/* ================================================== */

/**
 * @function
 * @name callAPI
 * @static
 *
 * @desc This function do the calls for our API.
 *
 * @param {string} url - The URL source for the API call.
 * @param {string} meta - The meta information for the API call.
 */
const callAPI = (url, meta) => {
  return new Promise((resolve, reject) => {
    $.getJSON(url + '&_=' + new Date().getTime(), function(data) {
      resolve([data, meta]);
    },
    function(err) {
      reject(err);
    })
  })
}

/**
* Method to generate the Hierarchical data for patient.
* The Structure will follow as
* Patient = {
  .....
  Studies = [
    {
      ......
      Series = [
        {
          ......
          Instances = {
            [

            ]
          }
        }
      ]
    }
  ]
}
*/

/**
 * @async
 * @function
 * @name getStudyList
 *
 * @desc Our study list getter.
 *
 * @param {string} callback - Our call back argument.
 */
async function getStudyList(callback) {
  var patients = await callAPI(patientsExpandedPath, patientList);
  return Promise.all(patients).then(result => {
    patientList = result[0];
    for (var patientIndex = 0; patientIndex < patientList.length; patientIndex++) {
      for (var study = 0; study < patientList[patientIndex].Studies.length; study++)
        studiesList.push(patientList[patientIndex].Studies[study]);
    }
    getStudyListData(studiesList);
  })
}

/**
 * @async
 * @function
 * @name getStudyListData
 *
 * @desc Our study list data getter.
 *
 * @param {string} studiesList - List of studies argument.
 */
async function getStudyListData(studiesList) {
  var studiesDeferred = [];
  for (var studyIndex = 0; studyIndex < studiesList.length; studyIndex++) {
    studiesDeferred[studyIndex] = await callAPI(studiesPath + studiesList[studyIndex] + '?', patientList);
  }
  return Promise.all(studiesDeferred).then(deferredData => {
    for (var index = 0; index < deferredData.length; index++) {
      var studyData = deferredData[index][0];
      studiesObjectData.push(studyData)
      for (var series = 0; series < studyData.Series.length; series++) {
        seriesList.push(studyData.Series[series]);
      }
    }
    getSeriesListData(seriesList);
  })
}

/**
 * @async
 * @function
 * @name getSeriesListData
 *
 * @desc Our series list getter.
 *
 * @param {string} studiesList - List of series argument.
 */
async function getSeriesListData(seriesList) {
  var studies = [];
  for (var seriesIndex = 0; seriesIndex < seriesList.length; seriesIndex++) {
    studies[seriesIndex] = await callAPI(seriesPath + seriesList[seriesIndex] + '?', patientList);
  }
  return Promise.all(studies).then(deferredData => {
    for (var index = 0; index < deferredData.length; index++) {
      var seriesData = deferredData[index][0];
      seriesObjectData.push(seriesData)
      for (var instance = 0; instance < seriesData.Instances.length; instance++) {
        instanceList.push(seriesData.Instances[instance]);
      }
    }
    getInstanceListData(instanceList);
  })
}

/**
 * @async
 * @function
 * @name getInstanceListData
 *
 * @desc Our instance list getter.
 *
 * @param {string} instanceList - List of instances argument.
 */
async function getInstanceListData(instanceList) {
  var instanceDeferred = [];
  for (var instanceIndex = 0; instanceIndex < instanceList.length; instanceIndex++) {
    instanceDeferred[instanceIndex] = await callAPI(instancesPath + instanceList[instanceIndex] + '?', patientList);
  }
  return Promise.all(instanceDeferred).then(deferredData => {
    for (var index = 0; index < deferredData.length; index++) {
      var instanceData = deferredData[index][0];
      instanceObjectData.push(instanceData)
    }
    mapInstanceInSeries();
    mapSeriesInStudies();
    mapStudiesInPatient();
    UpdatePatientData(patientList);
  })
}

/**
 * @function
 * @name mapInstanceInSeries
 * @static
 *
 * @desc Our instance in a set of series to map.
 */
var mapInstanceInSeries = function() {
  for (var x = 0; x < seriesObjectData.length; x++) {
    seriesObjectData[x].InstanceData = [];
    var newSeries = seriesObjectData[x].Instances.map(function(instance) {
      var instanceObject = instanceObjectData.filter(data => data.ID == instance);
      seriesObjectData[x].InstanceData.push(instanceObject[0]);
    })
  }
}

/**
 * @function
 * @name mapSeriesInStudies
 * @static
 *
 * @desc Our list of series in a set of studies to map.
 */
var mapSeriesInStudies = function() {
  for (var x = 0; x < studiesObjectData.length; x++) {
    studiesObjectData[x].SeriesData = [];
    var newStudies = studiesObjectData[x].Series.map(function(series) {
      var seriesObject = seriesObjectData.filter(data => data.ID == series);
      studiesObjectData[x].SeriesData.push(seriesObject[0]);
    })
  }
}

/**
 * @function
 * @name mapStudiesInPatient
 * @static
 *
 * @desc Our list of studies from a patient to map.
 */
var mapStudiesInPatient = function() {
  for (var x = 0; x < patientList.length; x++) {
    patientList[x].StudyData = [];
    var newPatient = patientList[x].Studies.map(function(study) {
      var studyObject = studiesObjectData.filter(data => data.ID == study);
      patientList[x].StudyData.push(studyObject[0]);
    })
  }
}

// Study List -> sl

getStudyList((studyList) => {})

/**
 * @function
 * @name UpdatePatientData
 * @static
 *
 * @desc This function updates the patient data. At the end, it populates
 *       with the new updates from the server.
 *
 * @param {Object} patients - Patients' source of information argument.
 */
var UpdatePatientData = function(patients) {
  if (patients.length > 0) {
    for (var i = 0; i < patients.length; i++) {

      var totalStudies = [];
      var studyListDataStructure = {};
      var studiesDataStructure = {};
      var fileName;

      for (var j = 0; j < patients[i].StudyData.length; j++) {
        const slEach = patients[i].StudyData[j];
        const slPatientAttr = slEach.PatientMainDicomTags;
        const slMainAttr = slEach.MainDicomTags;
        const slSeries = slEach.Series;

        const slPatientName = slPatientAttr.PatientName;
        const slPatientId = slPatientAttr.PatientID;
        const slStudyDate = slMainAttr.StudyDate;
        const slModality = slMainAttr.StudyDescription;
        const slStudyDescription = slMainAttr.StudyDescription;
        const slNumImages = slSeries.length;
        const slStudyId = slEach.ID;

        console.log("Get Study List From: ", JSON.stringify(slEach));
        console.log("Patient Name: ", JSON.stringify(slPatientName));
        console.log("Patient ID: ", JSON.stringify(slPatientId));
        console.log("Study Date: ", JSON.stringify(slStudyDate));
        console.log("Modality: ", JSON.stringify(slModality));
        console.log("Study Description: ", JSON.stringify(slStudyDescription));
        console.log("Number of Images: ", JSON.stringify(slNumImages));
        console.log("Study ID: ", JSON.stringify(slStudyId));

        //var fileName = slPatientName;
        var fileName = slPatientId;
        var seriesForFile = getSeriesForFile(patients[i].StudyData[j].SeriesData);

        studyListDataStructure = {
          "patientName": slPatientName,
          "patientId": slPatientId,
          "studyDate": slStudyDate,
          "modality": slModality,
          "studyDescription": slStudyDescription,
          "numImages": seriesForFile.TotalInstance,
          "studyId": fileName
        };


        studiesDataStructure = {
          "patientName": slPatientName,
          "patientId": slPatientId,
          "studyDate": slStudyDate,
          "modality": slModality,
          "studyDescription": slStudyDescription,
          "numImages": seriesForFile[0].instanceList.length, //slNumImages,
          "studyId": slStudyId,
          "seriesList": seriesForFile
        };

        totalStudies.push(studiesDataStructure);
      };
      studyListData[i] = studyListDataStructure;

      var patientFile = {
        "fileName": fileName,
        "fileData": totalStudies
      }
      studies[i] = patientFile;
    };

    studyList = {
      "studyList": studyListData
    };
    console.log(JSON.stringify(studies));

    $.ajax({
      url: '/UpdatePatients',
      data: JSON.stringify(studyList),
      type: 'POST',
      success: function(data) {
        console.log('File studyList.json successfully updated on server');
      },
      error: function(xhr, status, error) {
        console.log('Error Occured while saving file');
      }
    });

    var files = {
      "file": studies
    }

    $.ajax({
      url: '/UpdatePatientFile',
      data: JSON.stringify(files),
      type: 'POST',
      success: function(data) {
        console.log('patients File saved successfully on server');
      },
      error: function(xhr, status, error) {
        console.log('Error Occured while saving file');
      }
    });
  } else {
    UpdatePatientDataDefault();
  }
};

/**
 * @function
 * @name getSeriesForFile
 * @static
 *
 * @desc This function receives the data source of the series and gets
 *       the file to write on it.
 *
 * @param {Object} seriesData - Series' data source argument.
 */
var getSeriesForFile = function(seriesData) {
  var seriesFileData = new Array();
  var totalInstanceCount = 0;
  for (var index = 0; index < seriesData.length; index++) {
    var series = seriesData[index];
    var instanceForFile = getInstanceListForFile(series.InstanceData);
    totalInstanceCount += instanceForFile.length;
    if (series.InstanceData.length <= 1) {
      seriesFileData.push(getSeriesDataStructure(series, instanceForFile));
    } else {
      if (series.MainDicomTags.Modality == 'MR') {
        seriesFileData.push(getSeriesDataStructure(series, instanceForFile));
      } else {
        for (var ins = 0; ins < series.InstanceData.length; ins++) {
          var currentInstance = new Array();
          currentInstance.push(instanceForFile[ins]);
          seriesFileData.push(getSeriesDataStructure(series, currentInstance));
        }
      }
    }
  }
  seriesFileData.TotalInstance = totalInstanceCount;
  return seriesFileData;
}

/**
 * @function
 * @name getSeriesDataStructure
 * @static
 *
 * @desc The function receives both series and instance arguments and
 *       gets the data structure from it.
 *
 * @param {Object} series - The object of series from a study of a patient.
 * @param {Object} instance - The object of instance belonging to a series
 *                            from a study of a patient.
 */
var getSeriesDataStructure = function(series, instance) {
  var seriesDataStructure = {
    "seriesDescription": series.MainDicomTags.Modality,
    "seriesNumber": series.MainDicomTags.SeriesNumber,
    "instanceList": instance
  };

  return seriesDataStructure;
}

/**
 * @function
 * @name getInstanceListForFile
 * @static
 *
 * @desc The function receives data from an instance and gets the list
 *       of instances for the file.
 *
 * @param {Object} instanceData - The object of instances data source.
 */
var getInstanceListForFile = function(instanceData) {
  var instanceFileData = new Array();
  for (var index1 = 0; index1 < instanceData.length; index1++) {
    var series = instanceData[index1];
    var seriesDataStructure = {
      "imageId": instanceData[index1].ID + '/file'
    };
    instanceFileData.push(seriesDataStructure);
  }
  return instanceFileData;
}

/**
 * @function
 * @name UpdatePatientDataDefault
 * @static
 *
 * @desc The function updates the patient by default.
 */
var UpdatePatientDataDefault = function() {
  var studyListDefault = {
    "studyList": "default"
  };

  $.ajax({
    url: '/UpdatePatients',
    data: JSON.stringify(studyListDefault),
    type: 'POST',
    success: function(data) {
      console.log('File studyList.json successfully updated on server');
    },
    error: function(xhr, status, error) {
      console.log('Error Occured while saving file');
    }
  });
}
