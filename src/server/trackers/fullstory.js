/**
 * @file This file contains our FullStory Tracking Code manager. The file
 *       aims to track and manage the several server environments of
 *       the hereby project.
 *
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_org'] = 'J6XA6';
window['_fs_namespace'] = 'FS';

console.log('FullStory imported correctly...');

(function(m,n,e,t,l,o,g,y) {
	if (e in m) {
		if(m.console && m.console.log) {
			m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
		}
		return;
	}
	g = m[e] = function(a, b, s) {
		g.q?g.q.push([a,b,s]):g._api(a, b, s);
	};g.q=[];
	o = n.createElement(t);o.async = 1;
	o.src = 'https://'+_fs_host+'/s/fs.js';
	y = n.getElementsByTagName(t)[0];
	y.parentNode.insertBefore(o, y);
	g.identify = function(i, v, s){
		g(l, {uid:i}, s);
		if(v)g(l,v,s)
	};
	g.setUserVars = function(v, s){
		g(l, v, s)
	};
	g.event = function(i, v, s){
		g('event', {n:i,p:v}, s)
	};
	g.shutdown = function(){
		g("rec",!1)
	};
	g.restart = function(){
		g("rec",!0)
	};
	g.consent = function(a){
		g("consent", !arguments.length||a)
	};
	g.identifyAccount = function(i, v){
		o = 'account';
		v = v || {};
		v.acctId=i;g(o,v)
	};
	g.clearUserCookie=function(){};
})(window,document,window['_fs_namespace'],'script','user');

console.log('FullStory initialized correctly...');