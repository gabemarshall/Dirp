const color = require("cli-color");
var argv = require("yargs").argv;
const fs = require('fs');
let DISCOVERIES = [];
let latestDiscovery = '';
let REQUESTS = [];


exports.getCount = function () {
  return REQUESTS;
}
exports.addCount = function () {
  REQUESTS = REQUESTS + 1;
}

async function logToFile(discovery, path) {

  let logFilename = "dirp-" + discovery.split(" ")[1].split("/")[2].split(":")[0].replace(/\./g, "-") + '.log';
  let stream = fs.createWriteStream(logFilename, { flags: 'a' });

  try {
    let fileOut = discovery.split(" ");

    stream.write(`${fileOut[0]} ${fileOut[1].trim()} ${fileOut[2]} ${fileOut[3]}` + "\n");
  } catch (e) { }

  stream.end();
}

exports.addDiscovery = async function (discovery, bar, path) {
  if (argv.o || argv.output) {
    if (argv.o) {
      outputFile = argv.o;
    } else {
      outputFile = argv.output;
    }
    fs.appendFileSync(outputFile, discovery + "\n");
  }
  await logToFile(discovery, path);
  let currentBarTotal = bar.total;
  let currentBarVal = bar.value;

  bar.stop();
  //console.log(path[0]);
  let consoleOut = discovery.split(" ");
  console.log(`${consoleOut[0]} ${consoleOut[1].trim()} ${consoleOut[2]} ${consoleOut[3]}`)

  bar.start(currentBarTotal, currentBarVal);

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
