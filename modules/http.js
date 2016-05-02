var request = require('request'),
    cheerio = require('cheerio'),
    clc = require('cli-color'),
    error = clc.red.bold,
    warn = clc.yellow,
    notice = clc.cyanBright;

var dirp = request.defaults({'proxy':'', 'strictSSL':false})

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
var count = 0
exports.get = function(url, path, next, string) {

    var payload = clean(url + path);
    var test = '/('+string+')/'

    dirp({ url: payload, followAllRedirects: false, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36', 'Cookie': cooks } }, function(error, response, body) {
        try {
            if (response.statusCode != 404) {
                if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302 ) {
                    if (payload.match(/fZPfRfWKLfaLkfz/)) {
                        if (!string) {
                            console.log("A %s response code is being returned for a file that shouldn't exist", response.statusCode);
                            console.log("Use --string to provide a pattern to match for 'Page does not exist'");
                            process.exit();
                        } else {
                            console.log("Response string matched for a file that shouldn't exist");
                        }
                    } else {
                        console.log(notice("[+] "+payload+" looks to be valid"))
                    }
                    if (body.match(test)) {
                        console.log("Response string matched (Page Not Found or Invalid Session)");
                    }
                }
            } else {

            }
            if (count === 1){
                console.log("\n[*] Dirp is checking %s\n", url)
            } else {

            }
            count++;
            next();
        } catch (err) {
        }

    });
}
process.on('exit', function() {
    console.log("%s checks completed", count);
});
