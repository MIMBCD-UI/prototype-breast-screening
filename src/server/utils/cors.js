/**
 * @file CORS is a package providing us a middleware that can be used
 *       to enable CORS with various options.
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 *
 * @desc Cross-Origin Resource Sharing (CORS) is a mechanism that uses
 *       additional HTTP headers to tell a browser to let a web application
 *       running at one origin (domain) have permission to access selected
 *       resources from a server at a different origin. A web application
 *       makes a cross-origin HTTP request when it requests a resource that
 *       has a different origin (domain, protocol, and port) than its
 *       own origin.
 */

/**
 * @function
 * @name xdr
 * @static
 *
 * @desc Make a X-Domain request to url and callback.
 *
 * @param url {String} The URL Link to the request.
 * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc...).
 * @param data {String} request body.
 * @param callback {Function} to callback on completion.
 * @param errback {Function} to callback on error.
 */
function xdr(url, method, data, callback, errback) {
  var req;

  if (XMLHttpRequest) {
    req = new XMLHttpRequest();

    if ('withCredentials' in req) {
      req.open(method, url, true);
      req.onerror = errback;
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
          } else {
            errback(new Error('Response returned with non-OK status'));
          }
        }
      };
      req.send(data);
    }
  } else if (XDomainRequest) {
    req = new XDomainRequest();
    req.open(method, url);
    req.onerror = errback;
    req.onload = function() {
      callback(req.responseText);
    };
    req.send(data);
  } else {
    errback(new Error('CORS not supported'));
  }
}

console.log("CORS loaded!");
