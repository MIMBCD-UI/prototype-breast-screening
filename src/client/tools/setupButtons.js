/**
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

// File Management
var fileFormat = '.json';
var pathToSave = '../../dataset/';

// Time Stamp
var currentDate = new Date();
var year = currentDate.getFullYear();
var yearString = year.toString();
var month = currentDate.getMonth() + 1; //Be careful! January is 0 not 1
var monthString = (month < 9 ? '0' : '') + (month);
var date = currentDate.getDate();
var dateString = (date < 9 ? '0' : '') + (date);
var hours = currentDate.getHours();
var hoursString = (hours < 9 ? '0' : '') + (hours);
var minutes = currentDate.getMinutes();
var minutesString = (minutes < 9 ? '0' : '') + (minutes);
var seconds = currentDate.getSeconds();
var secondsString = (seconds < 9 ? '0' : '') + (seconds);
var totalDate = yearString + monthString + dateString;
var totalTime = hoursString + minutesString + secondsString;
var timeStamp = totalDate + totalTime;
var currentElement;

// var http = require('http');

// var server = http.createServer(function(req, res) {
//   res.writeHead(200);
//   res.end('Hello Http');
// });
// server.listen(8080);

const setupButtons = (studyViewer) => {
  // Get the button elements
  var buttons = $(studyViewer).find('button');

  // Tool button event handlers that set the new active tool

  // WW/WL
  $(buttons[0]).on('click touchstart', function() {
    disableAllTools();
    forEachViewport(function(element) {
      cornerstoneTools.wwwc.activate(element, 1);
      cornerstoneTools.wwwcTouchDrag.activate(element);
    });
  });

  // Invert
  $(buttons[1]).on('click touchstart', function() {
    disableAllTools();
    forEachViewport(function(element) {
      var viewport = cornerstone.getViewport(element);
      // Toggle invert
      if (viewport.invert === true) {
        viewport.invert = false;
      } else {
        viewport.invert = true;
      }
      cornerstone.setViewport(element, viewport);
    });
  });

  // Zoom
  $(buttons[2]).on('click touchstart', function() {
    disableAllTools();
    forEachViewport(function(element) {
      // 5 is right mouse button and left mouse button
      cornerstoneTools.zoom.activate(element, 5);
      cornerstoneTools.zoomTouchDrag.activate(element);
    });
  });

  // Pan
  $(buttons[3]).on('click touchstart', function() {
    disableAllTools();
    forEachViewport(function(element) {
      // 3 is middle mouse button and left mouse button
      cornerstoneTools.pan.activate(element, 3);
      cornerstoneTools.panTouchDrag.activate(element);
    });
  });

  // Stack scroll
  $(buttons[4]).on('click touchstart', function() {
    disableAllTools();
    forEachViewport(function(element) {
      cornerstoneTools.stackScroll.activate(element, 1);
      cornerstoneTools.stackScrollTouchDrag.activate(element);
    });
  });

  // Freehand ROI draw
  $(buttons[5]).on('click touchstart', function() { 
    if(cornerstoneTools.freehand.getConfiguration().currentTool < 0) {
      
    }
    disableAllTools();
    forEachViewport(function(element) { 
      currentElement = element;
      cornerstoneTools.probe.disable(element);
      cornerstoneTools.freehand.activate(element, 1);
    });
    
    
  });

  // Drag Probe
  $(buttons[6]).on('click touchstart', function() {
    disableAllTools();
    forEachViewport(function(element) {
      currentElement = element;
      cornerstoneTools.probe.activate(element, 1);
    });
  });

  // JSON Save Button
  $(buttons[7]).on('click touchstart', function() {
    disableAllTools();
    forEachViewport(function(element) {

      /**
       * time_stamp => YYYYMMDDHHmmSS
       *
       * Y: Year
       * M: Month
       * D: Day
       * H: Hour
       * m: minute
       * S: Second
       *
       */

      var freeHandToolData = cornerstoneTools.getToolState(element, 'freehand');
      var probeToolData = cornerstoneTools.getToolState(element, 'probe');
      var studyRoiData = studyViewer.roiData;
      var studyCurrentStack = studyRoiData.currentStack;
      var stack = studyRoiData.stacks[studyCurrentStack];
      var dataStudyId = studyRoiData.studyId;
      var dataPatientId = studyRoiData.patientId;
      var sourceNameToSave = dataStudyId;
      var fileNameToSave = sourceNameToSave + fileFormat;

      console.log("Study ROI Data: ", studyRoiData);

      if (freeHandToolData === undefined && probeToolData === undefined) {
        return;
      }

      console.log("TimeStamp: ", timeStamp);

      // The name of the file is the system studyId of the patient:
      // timeStamp + studyId
      // Example:
      // 20180223203337 + 123456789
      // Output File:
      // 20180223203337123456789.json

      console.log("Saved File Name: ", fileNameToSave);
      if(freeHandToolData !== undefined){
        stack.freehand = freeHandToolData.data;
      }
      if(probeToolData !== undefined){
        stack.probe = probeToolData.data;
      }

      //logic to warn to user if he has any missing annotations
      if(studyRoiData.stacks.length > 2){
        var filledIndex = [];
        for(var i=0; i<studyRoiData.stacks.length; i++){
          if(studyRoiData.stacks[i].freehand != undefined || studyRoiData.stacks[i].freehand != null
            && studyRoiData.stacks[i].seriesDescription == 'MRI'){
            filledIndex.push(i+1);
          }
        }
        var occupied = filledIndex[filledIndex.length -1] - filledIndex[0] + 1;
        var totalLength = filledIndex.length;

        // if(occupied != totalLength){
        //   stack.freehand = null;
        //   alert('Warning!' + '\n'  + 'There are missing annotations in between slices. Please annotate and save it first.');
        //   return;
        // }
      }

      console.log(studyRoiData);

      // save json
      // download(
      //   studyRoiData,
      //   fileNameToSave,
      //   'application/octet-stream'
      // );

      var pathFileNameToSave = fileNameToSave;
      var data = {
        rawData: studyRoiData,
        path: pathFileNameToSave
      };

      $.ajax({
        url: '/SaveFile',
        data: JSON.stringify(data),
        dataType: "text",
        type: 'POST',
        success: function(data) {
          console.log('File saved successfully on server');
        },
        error: function(xhr, status, error) {
          console.log('Error Occured while saving file');
        },
      });
    });
  });

  // Tooltips
  $(buttons[0]).tooltip();
  $(buttons[1]).tooltip();
  $(buttons[2]).tooltip();
  $(buttons[3]).tooltip();
  $(buttons[4]).tooltip();
  $(buttons[5]).tooltip();
  $(buttons[6]).tooltip();
  $(buttons[7]).tooltip();

  const download = (data, name, type) => {
    var link = document.createElement("a");
    var data = JSON.stringify(data, null, 4);
    var blob = new Blob([data], {
      type: 'application/octet-stream'
    });
    var url = URL.createObjectURL(blob, {
      type: type
    });

    link.setAttribute('href', url);
    link.setAttribute('download', name);

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click',
      true,
      true,
      window,
      1,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    link.dispatchEvent(event);
  }
};

$(document).keyup(function(e) {
  if (e.keyCode == 27 && currentElement !== undefined) { // escape key maps to keycode `27`
    var toolStateManager = cornerstoneTools.getElementToolStateManager(currentElement);
    var freehandToolState = toolStateManager.get(currentElement, 'freehand');
 
    if(freehandToolState){
      
      var freeToolArr = freehandToolState.data[freehandToolState.data.length-1];
      //console.log(freeToolArr.handles.length);
      
      freeToolArr.handles.pop(); 
      
      if(cornerstoneTools.freehand.getConfiguration().currentHandle > 0) 
        cornerstoneTools.freehand.getConfiguration().currentHandle--;
      
      if(freeToolArr.handles[freeToolArr.handles.length-1] !== undefined) {
        freeToolArr.handles[freeToolArr.handles.length-1].lines.pop();
      }

      //console.log(freeToolArr.handles[freeToolArr.handles.length-1]);

      //console.log(freeToolArr.handles[freeToolArr.handles.length-1].lines);
      //freehandToolState.data[freehandToolState.data.length-1].handles.pop();
      // for(var i=0; i<freehandToolState.data.length; i++){

      // }
      
      cornerstone.updateImage(currentElement);
      
    }

 }

});
