/**
 * @file Fetch for node and Browserify. This adds fetch as a global so
 *       that its API is consistent between client and server. You must
 *       bring your own ES6 Promise compatible polyfill.
 *
 * @exports utils/fetchImage
 * @requires isomorphic-fetch
 * @version 0.0.2
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

 const fetch = require('isomorphic-fetch');

/* ================================================== */
/**
 *
 * Load JSON configuration data from the sercer using
 * GET HTTP request. An export variable is therefore
 * of chief importance to export the module over our
 * server-side logic.
 *
 */
/* ================================================== */

var exports = module.exports = {};

/**
 * @function
 * @name fetchImagePatients
 * @static
 *
 * @desc The function is programmatically making requests in
 *       the browser. This project is an implementation of a subset
 *       of the standard Fetch specification, enough to make fetch
 *       a viable replacement for most uses of requests in traditional
 *       web applications. The function receives DICOM Link URL fetching
 *       it patient's list.
 *
 * @param {String} urlLinkDicomValue The DICOM Link URL.
 * @return {String} It fetch the DICOM Link URL list of patients.
 */

fetchImagePatients = function(urlLinkDicomValue) {
  fetch(urlLinkDicomValue + '/patients')
  .then(data => data.json())
}

/* ================================================== */
/** Module Exports                                    */
/* ================================================== */

exports.fetchImagePatients = fetchImagePatients;

/* ================================================== */

console.log('Fetch Image Patients: OK');
