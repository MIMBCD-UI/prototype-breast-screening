/**
 * @file This file contains our Matomo Tracking Code manager. The file
 *       aims to track and manage the several server environments of
 *       the hereby project.
 *
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

var _paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  
  var u="https://breastscreening.matomo.cloud/";
  
  _paq.push(['setTrackerUrl', u + 'matomo.php']);
  _paq.push(['setSiteId', '1']);
  
  var d = document
  var g = d.createElement('script');
  var s = d.getElementsByTagName('script')[0];
  
  g.type = 'text/javascript';
  g.async = true;
  g.defer = true;
  g.src = u + 'matomo.js';
  s.parentNode.insertBefore(g, s);

})();