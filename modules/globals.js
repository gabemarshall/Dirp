const argv = require("yargs").argv;

const utils = require('./utils.js');
const color = require("cli-color");

const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

let rp = require('request-promise');
let globalResults = require('./discoveries.js');

exports.settings = {
  req_one: {
    body: '',
    status: 0
  },
  req_two: {
    body: '',
    status: 0
  },
  score_type: "tlsh",
  threshold: argv.threshold || 50
};


let proxy = utils.getProxy();
let delay = argv.delay || false;
let threshold = exports.settings.threshold;

let cooks = utils.checkForCookies();


exports.initialize = async function () {
  let uniqValue_1 = Math.random().toString(36).substring(2);
  let uniqValue_2 = Math.random().toString(36).substring(2);
  uniqValue_2 = uniqValue_2 + uniqValue_2 + uniqValue_2; // Make the second test string longer to check for error messages returning the path

  let uniqRes_1 = {};
  let uniqRes_2 = {};

  let uniqueReq_1 = utils.prepareRequest(argv.u, uniqValue_1);
  let uniqueReq_2 = utils.prepareRequest(argv.u, uniqValue_2);

  let method = 'GET'; // Default method to use

  if (argv.method) {
    method = argv.method.toUpperCase();
  }

  let options = {};

  options.strictSSL = false;
  options.proxy = utils.getProxy();
  options.method = method;
  options.timeout = 15000;
  options.uri = uniqueReq_1;
  options.resolveWithFullResponse = true;
  options.followRedirect = false;
  options.followAllRedirects = false;
  options.simple = false;

  let response_1 = await rp(options);

  exports.settings.req_one.body = response_1.body;
  exports.settings.req_one.status = response_1.statusCode;

  options.uri = uniqueReq_2;

  let response_2 = await rp(options);

  exports.settings.req_two.body = response_2.body;
  exports.settings.req_two.status = response_2.statusCode;

  let score = utils.compareResponses(exports.settings.req_one.body, exports.settings.req_two.body);
  exports.settings.threshold = score.points


};
