const color = require("cli-color");
let DISCOVERIES = [];
let latestDiscovery = 'none';
let REQUESTS = [];

exports.getCount = function () {
  return REQUESTS;
}
exports.addCount = function () {
  REQUESTS = REQUESTS + 1;
}

exports.addDiscovery = function (discovery) {
  DISCOVERIES.push(discovery);
}

exports.getDiscoveries = function () {
  return DISCOVERIES;
}
exports.latestDiscovery = function (path) {

  if (path) {
    path = `/${path}`;
    latestDiscovery = `(${color.green(path)})`;
  }
  return latestDiscovery;
}