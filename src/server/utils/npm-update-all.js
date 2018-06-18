/**
 * @file This file will update all the packages to the latest version. When
 *       the project runs, it will do an ealry update and then run it.
 *
 * @requires npm-update-all
 * @version 0.0.1
 *
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

// In your server.js/index.js , run following code:

var updateAll = require('npm-update-all');
var json = require('./../../../package.json');

/**
 * @function
 * @name updateAll
 * @static
 *
 * @desc This function uses the `npm-update-all` a NodeJS package from npm
 *       that update all dependencies & devDependencies in `package.json`
 *       at once. **Global** installation is recommended for Cli usage.
 *
 * @param {string} json The function receives the `package.json` that is
 *                      a JSON file and updates all packages. At the end
 *                      we will have the project updated. Still, be aware
 *                      of possible issues regarding the package update.
 */

updateAll(json);
