var http = require('http');
var url = require("url");
var path = require("path");
var fs = require("fs");
var events = require('events');

var myEventHandler = function(path, data) {
  fs.writeFile('dataset/' + path, data, function(err) {
    if (err) {
      console.log('Error in saving file ');
    }
    console.log('file saved!');
  });
};

http.createServer(function(request, response) {

  if (request.url == 'SaveFile' || request.url == '/SaveFile' || request.url == './SaveFile') {
    var store = '';
    request.on('data', function(chunk) {
      store += chunk;
    });
    request.on('end', function() {

      var objectData = JSON.parse(store);
      myEventHandler(objectData.path, store);

      console.log(objectData.path);
    });
  }


  var filePath = '.' + request.url;
  if (filePath == './')
    filePath = './index.html';

  if (filePath == 'GetData') {
    myEventHandler();
  }

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      if (error.code == 'ENOENT') {
        fs.readFile('./404.html', function(error, content) {
          response.writeHead(200, {
            'Content-Type': contentType
          });
          response.end(content, 'utf-8');
        });
      } else {
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
        response.end();
      }
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      response.end(content, 'utf-8');
    }
  });
}).listen(8080);
