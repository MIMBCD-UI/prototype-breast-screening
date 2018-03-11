// Load in HTML templates
var viewportPath = "../public/templates/viewport.html";
var studyViewerPath = "../public/templates/studyViewer.html";

/* ========================= MESSAGES ========================= */

window.addEventListener('fileToDirectory', function (e) {
SaveData('data.txt', e.detail.rawData)
});

var SaveData = function(fileName, data){
  alert(fileName);
  var fs = require('fs');
  fs.writeFile(fileName,data, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
};

/* ============================================================ */

// The file with the list of all studies.
var fileName = '../common/studyList';
var fileFormat = '.json';
var studyListFile = fileName + fileFormat;

console.log('Read Study List File From: \n', studyListFile);

var viewportTemplate; // the viewport template
loadTemplate(viewportPath, function(element) {
    viewportTemplate = element;
});

var studyViewerTemplate; // the study viewer template
loadTemplate(studyViewerPath, function(element) {
    studyViewerTemplate = element;
});

// Get study list from JSON manifest
$.getJSON(studyListFile, function(data) {
  data.studyList.forEach(function(study) {

    // Create one table row for each study in the manifest
    var studyRow = '<tr><td>' +
    study.patientName + '</td><td>' +
    study.patientId + '</td><td>' +
    study.studyDate + '</td><td>' +
    study.modality + '</td><td>' +
    study.studyDescription + '</td><td>' +
    study.numImages + '</td><td>' +
    '</tr>';

    // Append the row to the study list
    var studyRowElement = $(studyRow).appendTo('#studyListData');

    // On study list row click
    $(studyRowElement).click(function() {

      // Add new tab for this study and switch to it
      var studyTab = '<li><a href="#x' + study.patientId + '" data-toggle="tab">' + study.patientName + '</a></li>';
      $('#tabs').append(studyTab);

      // Add tab content by making a copy of the studyViewerTemplate element
      var studyViewerCopy = studyViewerTemplate.clone();

      var viewportCopy = viewportTemplate.clone();
      studyViewerCopy.find('.imageViewer').append(viewportCopy);


      studyViewerCopy.attr("id", 'x' + study.patientId);
      // Make the viewer visible
      studyViewerCopy.removeClass('hidden');
      // Add section to the tab content
      studyViewerCopy.appendTo('#tabContent');

      // Show the new tab (which will be the last one since it was just added
      $('#tabs a:last').tab('show');

      // Toggle window resize (?)
      $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $(window).trigger('resize');
      });

      studyViewerCopy.roiData = {
        studyId: study.studyId,
        modality: study.modality,
        stacks: [],
      };

      // Now load the study.json
      loadStudy(studyViewerCopy, viewportTemplate, study.studyId + fileFormat);
    });
  });
});

// Show tabs on click
$('#tabs a').click (function(e) {
  e.preventDefault();
  $(this).tab('show');
});

// Resize main
function resizeMain() {
  var height = $(window).height();
  $('#main').height(height - 50);
  $('#tabContent').height(height - 50 - 42);
}

// Call resize main on window resize
$(window).resize(function() {
    resizeMain();
});
resizeMain();

// Prevent scrolling on iOS
document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
});
