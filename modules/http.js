var request = require('request'),
    cheerio = require('cheerio')

var dirp = request.defaults({pool: {maxSockets: 300},'proxy':''})

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

function tryAgain(payload, string){
    dirp({ url: payload, followAllRedirects: false, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36', 'Cookie': cooks } }, function(error, response, body) {
        try {
            if (response.statusCode != 404) {
                if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302 ) {
                    if (payload.match(/fZPfRfWKLfaLkfz/)) {
                        if (!string) {
                            console.log("A 200 response code is being returned for a file that shouldn't exist");
                            console.log("Use --string to provide a pattern to match for 'Page does not exist'");
                            process.exit();
                        } else {
                            console.log("Response string matched for a file that shouldn't exist");
                        }
                    } else {
                        console.log("%s looks to be valid", payload)
                    }
                    if (body.match(/Log In/)) {
                        //console.log("Response string matched (Page Not Found or Invalid Session)");
                    }
                }
            } else {

            }
            count++;
        } catch (err) {
           console.log(err);
        }

    });
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
var count = 0
exports.get = function(url, path, string) {
    var payload = clean(url + path);
    var test = '/(Log In)/'

    dirp({ url: payload, followAllRedirects: false, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36', 'Cookie': cooks } }, function(error, response, body) {
        try {
            if (response.statusCode != 404) {
                if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302 ) {
                    if (payload.match(/fZPfRfWKLfaLkfz/)) {
                        if (!string) {
                            console.log("A 200 response code is being returned for a file that shouldn't exist");
                            console.log("Use --string to provide a pattern to match for 'Page does not exist'");
                            process.exit();
                        } else {
                            console.log("Response string matched for a file that shouldn't exist");
                        }
                    } else {
                        console.log("%s looks to be valid", payload)
                    }
                    if (body.match(/Log In/)) {
                        //console.log("Response string matched (Page Not Found or Invalid Session)");
                    }
                }
            } else {

            }
            count++;
        } catch (err) {
            setTimeout(function(){
              tryAgain(payload, string);
            }, 10000);
        }

    });
}
process.on('exit', function() {
    console.log("%s checks completed", count);
});
