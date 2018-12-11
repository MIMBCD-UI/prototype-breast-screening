/**
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

function setupViewport(element, stack, image) {
  // Display the image on the viewer element
  cornerstone.displayImage(element, image);

  // var synchronizer = new cornerstoneTools.Synchronizer("cornerstoneimagerendered", cornerstoneTools.panZoomSynchronizer);

  // If it's a movie (has frames), then play the clip
  if (stack.frameRate !== undefined) {
    cornerstone.playClip(element, stack.frameRate);
  }

  // Activate mouse clicks, mouse wheel and touch
  cornerstoneTools.mouseInput.enable(element);
  cornerstoneTools.mouseWheelInput.enable(element);
  cornerstoneTools.touchInput.enable(element);

  // Enable all tools we want to use with this element
  cornerstoneTools.wwwc.activate(element); // ww/wc is the default tool for left mouse button fmc ,1
  cornerstoneTools.pan.activate(element, 3); // pan is the default tool for middle mouse button fmc ,2
  cornerstoneTools.zoom.activate(element, 0); // zoom is the default tool for right mouse button fmc ,4
  cornerstoneTools.probe.enable(element);
  cornerstoneTools.length.enable(element);
  cornerstoneTools.ellipticalRoi.enable(element);
  cornerstoneTools.rectangleRoi.enable(element);
  cornerstoneTools.wwwcTouchDrag.activate(element);
  cornerstoneTools.zoomTouchPinch.activate(element);
  cornerstoneTools.freehand.activate(element);

  // Stack tools
  cornerstoneTools.addStackStateManager(element, ['playClip']);
  cornerstoneTools.addToolState(element, 'stack', stack);
  cornerstoneTools.stackScrollWheel.activate(element);
  cornerstoneTools.stackPrefetch.enable(element);
  // synchronizer.add(element);


}
