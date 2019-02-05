/**
 * @file This file contains our Google Analytics manager. The file
 *       aims to track and manage the several server environments of
 *       the hereby project.
 *
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

console.log('Google Analytics imported correctly...');

window.dataLayer = window.dataLayer || [];

function gtag(){
	dataLayer.push(arguments);
}

gtag('js', new Date());

gtag('config', 'UA-133854111-1');

console.log('Google Analytics initialized correctly...');