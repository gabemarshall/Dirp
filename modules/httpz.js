const argv = require("yargs").argv
const hash = require('tlsh');
const helpers = require('./helpers.js');
const levenshtein = require('fast-levenshtein');
const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
let DigestHashBuilder = require('../node_modules/tlsh/lib/digests/digest-hash-builder');
let rp = require('request-promise');
let proxy = '';
let delay = argv.delay || false;

if (argv.proxy) {
    proxy = argv.proxy;
}
let cooks = "";

if (argv.cookie) {
    cooks = helpers.parseCookieString(argv.cookie);
}

function prepareRequest(uri, path) {
    path = path.replace('//', '/');
    if (argv.u.match(/((<INSERT\s*?.*?>))/gi)) {
        if (argv.trim) {
            path = path.replace(/(\..+)/gi, "")
        }
        var payload = argv.u.replace(/((<INSERT\s*?.*?>))/gi, path);

        return payload.replace(/(\s)/gi, "");
        //http.get(argv.u, args, testString, debug, payload);
    } else {

        var payload = path;
        var nth = 0;
        payload = payload.replace(/\/\//g, function (match, i, original) {
            nth++;
            return (nth === 2) ? "/" : match;
        });
        return uri + payload;

    }

}

let compareType = 'tlsh';
let uniqBodyHash;

function compareResponses(bodyOne, bodyTwo) {
    if (compareType === 'tlsh') {
        let bodyTwoHash = hash(bodyTwo);
        let digest1 = new DigestHashBuilder().withHash(uniqHash).build();
        let digest2 = new DigestHashBuilder().withHash(bodyTwoHash).build();

        let score = digest2.calculateDifference(digest1, true);
        return score;
    } else {
        let distance = levenshtein.get(bodyOne, bodyTwo)
        return distance;
    }
}
let uniqValue = 'f5e0548a3be37b529bf5d11669';
let uniqBody = '';

let uniqueTest = prepareRequest(argv.u, uniqValue);
let method = 'GET'; // Default method to use

if (argv.method) {
	 method = argv.method.toUpperCase();
}
let options = {};
options.strictSSL = false;
options.proxy = proxy
options.method = method;
options.timeout = 9000;
options.uri = uniqueTest;
options.resolveWithFullResponse = true;
options.followRedirect = false;
options.followAllRedirects = false;
options.simple = false;

rp(options).then(function (response) {
    if (response.body.length < 512) {
        compareType = 'lev'
        uniqBody = response.body;
    } else {
        uniqHash = hash(response.body);

    }
    if (argv.debug){
        console.log(`Debug - length of first request ${response.body.length}`);
    }

    //var hash1 = hash(response.body);
    //console.log(hash1);
    //process.exit(1);
})

//argv.u, testString, debug, pay
module.exports = async function (uri, testString, debug, path) {
    let method = 'GET'; // Default method to use
    if (argv.method) {
        method = argv.method.toUpperCase();
    }
    let finalPathStr = prepareRequest(uri, path)
    let options = {}
    options.headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36', 'Cookie': cooks };
    options.method = method;
    options.proxy = proxy;
    options.strictSSL = false;
    options.timeout = 5000;
    options.uri = finalPathStr;
    options.resolveWithFullResponse = true;
    options.followRedirect = false;
    options.followAllRedirects = false;
    options.simple = false;
    if (delay){
        
        if (debug){
            console.log(`Waiting ${delay} miliseconds`);    
        }
        
        await waitFor(delay);
    }
    return rp(options).then(function (response) {
        //response.httpVersion
        //response.statusCode
        //response.statusMessage;
        //for (i=0;i<response.rawHeaders.length;i=i+2){
        // response_headers+='\n'+response.rawHeaders[i]+": "+response.rawHeaders[i+1];
        //}
        //console.log(response.body)
        if (debug) {
            console.log(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`);
        }
        let firstMatch = 'None';
        let matches = 0;
        try {
            var re = new RegExp("(.{1,8}" + path + ".{1,8})");
            let matchy = response.body.match(re);
            let firstMatch = matchy[0];
            let matches = matchy.length
        } catch (err) {

        }


        try {
  //          if(response.statusCode===404){console.log(1);process.exit(1)};
            if (argv.compare) {
                let score = compareResponses(response.body, uniqBody);
                if (argv.debug){console.log(`Debug => ${compareType} score of ${score}`)}
                if (score > 50) {
                    console.log(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`);
                    return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, path: path }
                }
            } else if (response.statusCode === argv.status){
              //process.exit(1)
								console.log(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`);
							 	return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, path: path }
            }
          else {
                if (response.statusCode != 404 && !argv.status) {
                    if ((response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 403 || response.statusCode === 401 || response.statusCode == 405 || response.statusCode === 500)) {
                        //if (compareResponses(response.body, uniqBody) > 50){
                        console.log(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`);
                        return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, path: path }
                        //}

                    }
                }
            }


        } catch (err) {

        }


        //console.log(finalPathStr.split('/')[2] + " " + response.statusCode);


    })
        .catch(function (err) {
            //console.log(err);
            // Crawling failed...

        });

}
