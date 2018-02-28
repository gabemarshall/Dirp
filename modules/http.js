var request = require('request'),
    cheerio = require('cheerio'),
    clc = require('cli-color'),
    doh = clc.red.bold,
    warn = clc.yellow,
    notice = clc.cyanBright;
    argv = require('yargs').argv

var proxy = '';

if (argv.proxy){
  proxy = argv.proxy;
}

var method = 'GET'; // Default method to use

if (argv.method){
    method = argv.method.toUpperCase();    
}

var dirp = request.defaults({'proxy':proxy, 'strictSSL':false, 'method':method})

var cooks = "";

exports.cookies = function(cookies) {
    cookies = cookies.split(';');
    for (i = 0; i < cookies.length; i++) {
        cookie = cookies[i].trim();
        if (cookie) {
            cooks += cookie + ";";
        }
    }

}

function clean(payload) {
    var s = payload;
    var nth = 0;
    s = s.replace(/\/\//g, function(match, i, original) {
        nth++;
        return (nth === 2) ? "/" : match;
    });
    return s;
}

exports.get = function(url, path, string, debug, insertion) {


    if (insertion){
       var payload = insertion;
    } else {
        var payload = clean(url + path);
    }

    if (string){
        var test = new RegExp(string, 'g');
    } else {
        var test = false;
    }
    
    dirp({ url: payload, followAllRedirects: false, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36', 'Cookie': cooks } }, function(error, response, body) {
        try {
            if (debug){
              console.log(payload+" - "+response.statusCode);
            }
            
            if (response.statusCode != 404 && !argv.status) {
                if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 403) {

                    if (body.match(test)) {
                        //console.log("Response string matched (Page Not Found or Invalid Session)");
                    } else if (payload.match(/fZPfRfWKLfaLkfz/)) {
                        if (!string) {
                            console.log("A %s response code is being returned for a file that shouldn't exist", response.statusCode);
                            console.log("Use --string to provide a pattern to match for 'Page does not exist'");
                            if (!argv.status){
                                process.exit();
                            }
                        } else {
                            console.log("Response string matched for a file that shouldn't exist");
                        }
                    }
                    else {
                        console.log(notice("[+] "+payload+" looks to be valid"))
                    }
                }
            } else {
                if (argv.status === response.statusCode){
                    console.log(notice("[+] "+payload+" looks to be valid"))
                }
            }
            
        } catch (err) {
            console.log(doh("Error connecting to the host.. stopping!\n"))
            process.exit(1)
        }

    });
}
