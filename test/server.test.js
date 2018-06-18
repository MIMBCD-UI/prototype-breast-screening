/**
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

var server = require('../src/server/index.js');
var requests = require("../src/server/utils/requests");

var getConfigFileValue = requests.getConfigFileValue();
var getPortValue = requests.getPortValue();

// console.log("Testing Get Port Value Request:\n", getPortValue);
// console.log("Testing Get Config File Value Request:\n", getConfigFileValue);

if(getConfigFileValue === 'local') {
  test('Port Value', () => {
    expect(getPortValue).toBe('8080');
  });
} else if(getConfigFileValue === 'dev') {
  test('Port Value', () => {
    expect(getPortValue).toBe('8083');
  });
} else if(getConfigFileValue === 'internal') {
  test('Port Value', () => {
    expect(getPortValue).toBe('8085');
  });
} else if(getConfigFileValue === 'integration') {
  test('Port Value', () => {
    expect(getPortValue).toBe('8084');
  });
} else if(getConfigFileValue === 'stage') {
  test('Port Value', () => {
    expect(getPortValue).toBe('8082');
  });
} else if(getConfigFileValue === 'test') {
  test('Port Value', () => {
    expect(getPortValue).toBe('8081');
  });
} else if(getConfigFileValue === 'prod') {
  test('Port Value', () => {
    expect(getPortValue).toBe('8088');
  });
} else {
  console.log("ERROR: wrong environemnt");
}
