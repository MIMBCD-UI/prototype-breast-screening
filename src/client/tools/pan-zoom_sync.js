console.log("fmc");

    var imgAreaElement = document.getElementById('imgArea');

    var imageId = 'example://1';

    var synchronizer = new cornerstoneTools.Synchronizer("cornerstoneimagerendered", cornerstoneTools.panZoomSynchronizer);


    cornerstoneTools.mouseInput.enable(imgAreaElement);
    cornerstoneTools.mouseWheelInput.enable(imgAreaElement);


    cornerstone.loadImage(imageId).then(function(image) {
        // display this image
        cornerstone.displayImage(imgAreaElement, image);
        // Enable pan and zoom
        cornerstoneTools.pan.activate(imgAreaElement, 1);
        cornerstoneTools.zoomWheel.activate(imgAreaElement);
        cornerstoneTools.zoom.activate(imgAreaElement, 4);

        // add each element to the synchronizer
        synchronizer.add(imgAreaElement);

        function activate(id)
        {
            document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
            document.getElementById(id).classList.add('active');
        }
        document.getElementById('add').addEventListener('click', function() {
            activate("add");
            synchronizer.add(imgAreaElement);
            return false;
        });
        document.getElementById('remove').addEventListener('click', function() {
            activate("remove");
            synchronizer.remove(imgAreaElement);
            return false;
        });
        document.getElementById('add3').addEventListener('click', function() {
            activate("add3");
            synchronizer.add(axialElement3);
            return false;
        });
        document.getElementById('remove3').addEventListener('click', function() {
            activate("remove3");
            synchronizer.remove(axialElement3);
            return false;
        });

    });
