const color = require("cli-color");
let DISCOVERIES = [];
let latestDiscovery = ' ';

exports.addDiscovery = function(discovery){
  DISCOVERIES.push(discovery);
}

exports.getDiscoveries = function(){
  return DISCOVERIES;
}
exports.latestDiscovery = function(path){

  if (path){
    path = `/${path}`;
    latestDiscovery = `(${color.green(path)})`;
  }
  return latestDiscovery;
}