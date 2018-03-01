/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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

/* ==================== TESTING THINGS!!!! ==================== */

var message = __webpack_require__(1);

alert(message);

/* ============================================================ */


/***/ }),
/* 1 */
/***/ (function(module, exports) {

loadTemplate("templates/about.html", function(element) {
    $('body').append(element);
    $("#about").click(function() {
        $("#aboutModal").modal();
    });
});

/* ==================== TESTING THINGS!!!! ==================== */

module.exports = "my message alert!";

/* ============================================================ */


/***/ })
/******/ ]);