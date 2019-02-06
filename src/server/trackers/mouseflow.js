/**
 * @file This file contains our Mouseflow Tracking Code manager. The file
 *       aims to track and manage the several server environments of
 *       the hereby project.
 *
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

/* ================================================== */
/** Base Declarable Variables                        **/
/* ================================================== */

var msg001 = 'Mouseflow imported correctly...';
var msg002 = 'Mouseflow initialized correctly...';

var str001 = "script";
var str002 = "text/javascript";
var str003 = "//cdn.mouseflow.com/projects/";
var str004 = "4c8861eb-8790-4993-8d10-db0da7a5947b.js";
var str005 = "head";

var mrg001 = str003 + str004;

/* ================================================== */

window._mfq = window._mfq || [];

console.log(msg001);

(function() {
	var mf = document.createElement(str001);
	mf.type = str002;
	mf.async = true;
	mf.src = mrg001;
	document.getElementsByTagName(str005)[0].appendChild(mf);
})();

console.log(msg002);