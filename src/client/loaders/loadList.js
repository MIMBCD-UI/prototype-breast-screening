var studyListData = [];
var studyList = {};
var studies = [];
var studiesDataStructure = {};

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

var patientList = {};
var studiesList = [];
var studiesObjectData = [];
var seriesList = [];
var seriesObjectData = [];
var instanceList = [];
var instanceObjectData = [];


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
async function getStudyList(callback) {
  var patients = await callAPI('http://localhost:8042/patients?expand', patientList);
  return Promise.all(patients).then(result => {
    patientList = result[0];
    for (var patientIndex = 0; patientIndex < patientList.length; patientIndex++) {
      for (var study = 0; study < patientList[patientIndex].Studies.length; study++)
        studiesList.push(patientList[patientIndex].Studies[study]);
    }
    getStudyListData(studiesList);
  })
}

async function getStudyListData(studiesList) {
  var studiesDeferred = [];
  for (var studyIndex = 0; studyIndex < studiesList.length; studyIndex++) {
    studiesDeferred[studyIndex] = await callAPI('http://localhost:8042/studies/' + studiesList[studyIndex] + '?', patientList);
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

async function getSeriesListData(seriesList) {
  var studies = [];
  for (var seriesIndex = 0; seriesIndex < seriesList.length; seriesIndex++) {
    studies[seriesIndex] = await callAPI('http://localhost:8042/series/' + seriesList[seriesIndex] + '?', patientList);
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

async function getInstanceListData(instanceList) {
  var instanceDeferred = [];
  for (var instanceIndex = 0; instanceIndex < instanceList.length; instanceIndex++) {
    instanceDeferred[instanceIndex] = await callAPI('http://localhost:8042/instances/' + instanceList[instanceIndex] + '?', patientList);
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

var mapInstanceInSeries = function() {
  for (var x = 0; x < seriesObjectData.length; x++) {
    seriesObjectData[x].InstanceData = [];
    var newSeries = seriesObjectData[x].Instances.map(function(instance) {
      var instanceObject = instanceObjectData.filter(data => data.ID == instance);
      seriesObjectData[x].InstanceData.push(instanceObject[0]);
    })
  }
}

var mapSeriesInStudies = function() {
  for (var x = 0; x < studiesObjectData.length; x++) {
    studiesObjectData[x].SeriesData = [];
    var newStudies = studiesObjectData[x].Series.map(function(series) {
      var seriesObject = seriesObjectData.filter(data => data.ID == series);
      studiesObjectData[x].SeriesData.push(seriesObject[0]);
    })
  }
}

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

var UpdatePatientData = function(patients) {
  if (patients.length > 0) {
    for (var i = 0; i < patients.length; i++) {
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
        const slStudyId = slPatientAttr.PatientID;

        console.log("Get Study List From: ", JSON.stringify(slEach));
        console.log("Patient Name: ", JSON.stringify(slPatientName));
        console.log("Patient ID: ", JSON.stringify(slPatientId));
        console.log("Study Date: ", JSON.stringify(slStudyDate));
        console.log("Modality: ", JSON.stringify(slModality));
        console.log("Study Description: ", JSON.stringify(slStudyDescription));
        console.log("Number of Images: ", JSON.stringify(slNumImages));
        console.log("Study ID: ", JSON.stringify(slStudyId));

        var studyListDataStructure = {
          "patientName": slPatientName,
          "patientId": slPatientId,
          "studyDate": slStudyDate,
          "modality": slModality,
          "studyDescription": slStudyDescription,
          "numImages": slNumImages,
          "studyId": slPatientName
        };


        var studiesDataStructure = {
          "patientName": slPatientName,
          "patientId": slPatientId,
          "studyDate": slStudyDate,
          "modality": slModality,
          "studyDescription": slStudyDescription,
          "numImages": slNumImages,
          "studyId": slStudyId,
          "seriesList": getSeriesForFile(patients[i].StudyData[j].SeriesData)
        };

        var patientFile = {
          "fileName": slPatientName,
          "fileData": studiesDataStructure
        }
        studies[i] = patientFile;

        //studies.push(patientFile);

        studyListData[i] = studyListDataStructure;

      };
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

var getSeriesForFile = function(seriesData) {
  var seriesFileData = new Array();
  for (var index = 0; index < seriesData.length; index++) {
    var series = seriesData[index];
    var seriesDataStructure = {
      "seriesDescription": series.MainDicomTags.Modality,
      "seriesNumber": series.MainDicomTags.SeriesNumber,
      "instanceList": getInstanceListForFile(series.InstanceData)
    };

    seriesFileData.push(seriesDataStructure);
  }
  console.log(seriesFileData)
  return seriesFileData;
}

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
