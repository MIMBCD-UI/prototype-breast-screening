function callAPI(url) {
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

getStudyList((studyList) => {
    const studyListPatientName = studyList[0].PatientMainDicomTags.PatientName;
    const studyListPatientId = studyList[0].PatientMainDicomTags.PatientID;
    const studyListStudyDate = studyList[0].MainDicomTags.StudyDate;
    const studyListModality = studyList[0].MainDicomTags.StudyDescription;
    const studyListStudyDescription = studyList[0].MainDicomTags.StudyDescription;
    const studyListNumImages = 0;
    const studyListStudyId = studyList[0].PatientMainDicomTags.PatientID;

    console.log("Get Study List From: ", JSON.stringify(studyList[0]));
    console.log("studyListPatientName: ", JSON.stringify(studyListPatientName));
    console.log("studyListPatientId: ", JSON.stringify(studyListPatientId));
    console.log("studyListStudyDate: ", JSON.stringify(studyListStudyDate));
    console.log("studyListModality: ", JSON.stringify(studyListModality));
    console.log("studyListStudyDescription: ", JSON.stringify(studyListStudyDescription));
    console.log("studyListNumImages: ", JSON.stringify(studyListNumImages));
    console.log("studyListStudyId: ", JSON.stringify(studyListStudyId));
})
