/**
 * @file This file contains the Index scripts for the UI. It is here
 *       where the several tabs are created and viewports.
 *
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

// Load in HTML templates
var viewportPath = "../public/templates/viewport.html";
var studyViewerPath = "../public/templates/studyViewer.html";

// The file with the list of all studies.
var fileName = '../common/studyList';
var fileFormat = '.json';
var studyListFile = fileName + fileFormat;

console.log('Read Study List File From: \n', studyListFile);

/**
 * @function
 * @name viewportTemplate
 * @static
 *
 * @desc From a Viewport Path it loads the template.
 *
 * @returns {string} element - The viewport template element.
 */
var viewportTemplate;
loadTemplate(viewportPath, function(element) {
  viewportTemplate = element;
  console.log(viewportPath);
});

/**
 * @function
 * @name studyViewerTemplate
 * @static
 *
 * @desc From a Study Viewer Path it loads the template.
 *
 * @returns {string} element - The study viewer template element.
 */
var studyViewerTemplate;
loadTemplate(studyViewerPath, function(element) {
  studyViewerTemplate = element;
});

/**
 * @function
 * @name studyViewerTemplate
 * @static
 *
 * @desc Get study list from JSON manifest.
 *
 * @returns {Object} data - The data object obtained from the
 *                   `studyList.json` file.
 */
$.getJSON(studyListFile, function(data) {
  console.log("Getting study list...");
  if (typeof data.studyList === "object") {
    console.log("Consuming study list...");
    data.studyList.forEach(function(study) {
      console.log("Creating study list tables...");
      // Create one table row for each study in the manifest
      var studyRow = '<tr><td>' +
        study.patientId + '</td><td>' +
        //study.internalId + '</td><td>' +
        study.studyDate + '</td><td>' +
        study.modality + '</td><td>' +
        study.studyDescription + '</td><td>' +
        study.numImages + '</td><td>' +
        '</tr>';

      // Append the row to the study list
      var studyRowElement = $(studyRow).appendTo('#studyListData');

      // On study list row click
      $(studyRowElement).click(function() {

        // var session = require('client-sessions');

        if ($('#tabs li').length >= 2) {
          alert('Please close the opened patient first !');
        } else {
          // Add new tab for this study and switch to it
          var studyTab = '<li><div id=complete-tab><a href="#x' + study.patientId + '" data-toggle="tab">' + study.patientId + '</a>' +
          //var studyTab = '<li><div id=complete-tab><a href="#x' + study.patientId + '" data-toggle="tab">' + study.internalId + '</a>' +
            '<input id="close" href="#" type="button" class="closeBtn" value="X" />' +'<span id="modifiedStar" style="color: white;padding-left: 2px; display:none;">*</span>' +  '</li></div>'; ///fmc
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

            patientId: study.patientId,
            patientName : study.patientName,
            studyId: study.studyId,
            modality: study.modality,
            stacks: [],
          };

          $('.closeBtn').click(function() {
            var element = this.parentNode.parentNode;
            if($('#modifiedStar').css('display') == 'inline')
            {
              $('#saveModal').modal('show');
            } else {
              $('#tabs a:first').tab('show');
              element.remove();
              var tabDataElement = element.firstChild.firstChild.getAttribute('href');
              if($(tabDataElement).length > 0) {
                $(tabDataElement)[0].remove();
              }
            }
            
          });

          // Now load the study.json
          loadStudy(studyViewerCopy, viewportTemplate, study.studyId + fileFormat);
        }
      });
    });
  } else {
    console.log("There is no list of studies. Please Upload some DICOM files.");
  }
});

// Resize main


// Show tabs on click
$('#tabs a').click (function(e) {
  e.preventDefault();
  $(this).tab('show');
});

// Resize main
function resizeMain() {
  var height = $(window).height();
  $('#main').height(height - 50);
  $('#tabContent').height(height - 100 - 42);
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
