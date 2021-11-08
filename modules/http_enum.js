const argv = require("yargs").argv;

const utils = require('./utils.js');
const color = require("cli-color");
const globals = require("./globals");
const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

let rp = require('request-promise');
let globalResults = require('./discoveries.js');

let threshold = globals.settings.threshold;


let proxy = utils.getProxy();
let delay = argv.delay || false;
let jitter = argv.jitter || false;

let cooks = utils.checkForCookies();


//argv.u, testString, debug, pay
module.exports = async function (uri, testString, debug, path, bar) {
    let method = 'GET'; // Default method to use
    if (argv.method) {
        method = argv.method.toUpperCase();
    }
    if (argv.X){
        method = argv.X.toUpperCase();
    }
    let finalPathStr = utils.prepareRequest(uri, path)

    let options = {}
    options.headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36', 'Cookie': cooks };
    options.method = method;
    options.proxy = proxy;
    options.strictSSL = false;
    options.timeout = 15000;
    options.uri = finalPathStr;
    options.resolveWithFullResponse = true;
    options.followRedirect = false;
    options.followAllRedirects = false;
    options.simple = false;

    if (delay) {

        if (jitter){
            delay = Math.round(utils.jitter(delay, jitter))
        }

        if (debug) {
            console.log(`Waiting ${delay} miliseconds`);
        }

        await waitFor(delay);
    }

    path = path.match(/([ -~]+)/)
    if (!path) {
        path = '...';
    }


    return rp(options).then(function (response) {
        if (!argv.debug) {
            bar.increment(1, {
                reqPath: path,
                discoveries: globalResults.getDiscoveries().length.toString(),
            });
        }
        //response.httpVersion
        //response.statusCode
        //response.statusMessage;
        //for (i=0;i<response.rawHeaders.length;i=i+2){
        // response_headers+='\n'+response.rawHeaders[i]+": "+response.rawHeaders[i+1];
        //}
        //console.log(response.body)
        if (debug) {
            let debugStr = method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`;
            console.log(debugStr);
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

        let discStr;
        try {

            if (argv.compare) {

                //console.log(response.body.length);

                let score = utils.compareResponses(response.body, globals.settings.req_one.body);
                //if (argv.debug) { console.log(`Debug => ${score.type} score of ${score.points}`) }
                //console.log(globals.settings.threshold);
                if (score.points > globals.settings.threshold && response.statusCode != 404) {

                    // console.log(`${globals.settings.score_type} => ${globals.settings.threshold}`);
                    if (argv.status) {
                        // console.log("HEY WE're HERE");
                        // process.exit(1);
                        if (argv.status === response.statusCode) {
                            globalResults.latestDiscovery(path);
                            globalResults.addDiscovery(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, bar, path);
                        }
                    } else {
                        globalResults.latestDiscovery(path)
                        globalResults.addDiscovery(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, bar, path);
                    }


                    return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, path: path }
                }
                // else if (response.statusCode != globals.settings.req_one.status) {
                //     globalResults.latestDiscovery(path)
                //     globalResults.addDiscovery(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, bar, path);

                //     return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode} (?)]`, path: path }
                // }



            } else if (argv.status) {
                if (argv.inverse) {
                    if (response.statusCode != argv.status) {
                        globalResults.latestDiscovery(path)
                        globalResults.addDiscovery(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, bar, path);
                        return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, path: path }
                    }
                } else {
                    if (response.statusCode === argv.status) {
                        globalResults.latestDiscovery(path)
                        globalResults.addDiscovery(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, bar, path);
                        return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, path: path }
                    }
                }

            }
            else {
                if (globals.settings.req_one.status === 200) {
                    bar.stop();
                    console.log("")
                    console.log(globals.settings.req_one);
                    console.log(color.red("[!] The application appears to return an HTTP 200 for all requests"));

                    console.log(color.green("[+] Hint: You may want to try customizing the HTTP method (ex: --method OPTIONS) and/or use --compare option"));
                    process.exit(1);
                } else {
                    if (response.statusCode != globals.settings.req_one.status) {
                        globalResults.latestDiscovery(path);

                        globalResults.addDiscovery(method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, bar, path);
                        return { raw: method + " " + finalPathStr + " " + response.body.length + " " + `[${response.statusCode}]`, path: path };
                    }
                }


                //}

            }





        } catch (err) {

            if (argv.debug) {
                console.log(err);
            }

        }

    })
        .catch(function (err) {
            if (argv.debug) {
                console.log(err);
            }
        });

}
