var request = require('request'),
    cheerio = require('cheerio'),
    clc = require('cli-color'),
    fs = require('fs'),
    doh = clc.red.bold,
    warn = clc.yellow,
    notice = clc.cyanBright;
    argv = require('yargs').argv

var proxy = '';
var errors = 0;

if (argv.proxy){
  proxy = argv.proxy;
}

var method = 'GET'; // Default method to use

if (argv.method){
    method = argv.method.toUpperCase();    
}

var dirp = request.defaults({'proxy':proxy, 'strictSSL':false, 'method':method})

var cooks = "";
exports.discoveries = []
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
              console.log(payload+" - "+response.statusCode+" - "+response.body.length);
            } else {
                    //
            }
                let firstMatch = 'None';
                let matches = 0;
                try {
                    var re = new RegExp("(.{1,8}"+path+".{1,8})"); 
                    let matchy = response.body.match(re);
                    let firstMatch = matchy[0];
                    let matches = matchy.length
                } catch(err){
                    
                }
                
            //}
            
            if (response.statusCode != 404 && !argv.status) {
                if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 403 || response.statusCode === 401 || response.statusCode === 500) {

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

                        //process.stdout.write(notice("\n[+] "+payload+" looked to be valid"))
                        
                        exports.discoveries.push({ url: payload, status: response.statusCode, len: response.body.length, match: firstMatch, matchLen: matches})
                    }
                }
            } else if (argv.fuzz){

                
                exports.discoveries.push({ url: payload, status: response.statusCode, len: response.body.length, match: firstMatch, matchLen: matches})
            }
            else {
                if (argv.status === response.statusCode){
                    //process.stdout.write(notice("\n[+] "+payload+" looked to be valid"))
                    exports.discoveries.push({ url: payload, status: response.statusCode, len: response.body.length, match: firstMatch, matchLen: matches})
                } else {
                    console.log('\x1B[1A\x1B[K' +response.statusCode+' => '+payload);
                }
            }
            
            fs.appendFile('dirp.log', '\n==============================\n'+response.body, 'utf-8', function(){

            });
            
        } catch (err) {
            console.log(err)
            errors++;
            
            if (!argv.force && errors > 5){
                console.log(doh("\x1B[1A\x1B[K Too many errors, quitting"))
                process.exit(1)    
            } else {
                console.log(doh("\x1B[1A\x1B[K Error #"+errors+" - failed to connect to host (ctrl + c to quit)"))    
            }
            
        }

    });
}
