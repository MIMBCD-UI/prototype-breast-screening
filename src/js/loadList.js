/* ==================== TESTING THINGS!!!! ==================== */

// var message = require('./about');

// alert(message);

/* ============================================================ */

const callAPI = (url) => {
  return new Promise((resolve, reject) => {
    $.getJSON(url + '&_=' + new Date().getTime(), function(data) {
        resolve(data);
      },
      function(err) {
        reject(err);
      })
  })
}

async function getStudyList(callback) {
  const patients = await callAPI('http://localhost:8042/patients?expand')
  const p = patients.reduce((prev, next) => {
    return prev.concat(next.Studies);
  }, []).map(studyId => {
    const url = 'http://localhost:8042/studies/' + studyId + '?';
    return callAPI(url).then(result => result);
  })

  return Promise.all(p).then(result => {
    callback(result);
  })
}

// Study List -> sl

getStudyList((studyList) => {
  for (var i = 0; i < studyList.length; i++) {
    const slEach = studyList[i];
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
  }
})
