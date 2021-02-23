const argv = require("yargs").argv;
const globals = require("./globals");
const hash = require('tlsh');
const levenshtein = require('fast-levenshtein');
let DigestHashBuilder = require('tlsh/lib/digests/digest-hash-builder');

exports.parseCookieString = function (cookies) {
  let cooks = "";
  cookies = cookies.split(';');
  for (i = 0; i < cookies.length; i++) {
    cookie = cookies[i].trim();
    if (cookie) {
      cooks += cookie + ";";
    }
  }
  return cooks;

};

exports.getProxy = function () {
  if (argv.proxy) {
    return argv.proxy;
  } else {
    return "";
  }
};

exports.checkForCookies = function () {
  if (argv.cookie) {
    return exports.parseCookieString(argv.cookie);
  } else {
    return "";
  }
};

exports.prepareRequest = function (uri, path) {

  let insMatch = argv.u.match(/((<INSERT\s*?.*?>))/gi);

  // If "/" isn't the first character, and the <INSERT> feature isn't being used
  // Add a / to make sure the path is valid

  if (path[0] != '/' && !insMatch) {
    path = "/" + path;
  }

  if (insMatch) {

    if (argv.trim) {
      path = path.replace(/(\..+)/gi, "")
    }
    var payload = argv.u.replace(/((<INSERT\s*?.*?>))/gi, path);

    payload = payload.replace(/(\s)/gi, "");
    //http.get(argv.u, args, testString, debug, payload);
  } else {

    var payload = uri + path;

  }
  var nth = 0;
  payload = payload.replace(/\/\//g, function (match, i, original) {
    nth++;
    return (nth === 2) ? "/" : match;
  });
  return payload;

}

exports.compareResponses = function (bodyOne, bodyTwo) {
  let compareResults = {}
  let points;
  let scoreType;
  try {

    scoreType = globals.settings.score_type;
    let bodyOneHash = hash(bodyOne);
    let bodyTwoHash = hash(bodyTwo);
    let digest1 = new DigestHashBuilder().withHash(bodyOneHash).build();
    let digest2 = new DigestHashBuilder().withHash(bodyTwoHash).build();
    points = digest2.calculateDifference(digest1, true);
  } catch (err) {
    points = levenshtein.get(bodyOne, bodyTwo);

    scoreType = 'lev'
    globals.settings.score_type = scoreType;
  }
  compareResults = { points: points, type: scoreType }

  return compareResults

}
