#!/usr/bin/env node

var argv = require('yargs').argv,
    http = require('./modules/http'),
    color = require('cli-color'),
    payloads = require('./modules/loadPayloads'),
    async = require('async'),
    fs = require('fs');

if (argv.help || argv.h) {
    console.log(color.green("\n--[Scouting Examples]--\n"));
    console.log("[1.] Scout a subnet for low hanging fruit on port 8080");
    console.log(color.blackBright("\n\t$> scout --ip=192.168.0.0/24 --port=8080\n"));
    console.log("[2.] Scout a subnet for various ports -- printing results of each open port");
    console.log(color.blackBright("\n\t$> scout --ip=192.168.0.0/24 --port=80,443,8443,8080-8082 --open\n"));

    console.log(color.blackBright("\t--rate") + " Number of open sockets per scan - default 500");
    console.log(color.blackBright("\t--timeout") + " Number of miliseconds before deciding port is closed - default 3000");
    console.log(color.blackBright("\t--logging") + " Enable\\Disable logging (results are saved to scout.log) - default true\n")


    console.log(color.red("\n--[Exploitation Examples]--\n"));
    console.log("[1.] Run a command against a known Jenkins server (that has the script console enabled)");
    console.log(color.blackBright("\n\t$> scout --ip=192.168.0.109 --target=jenkins --cmd='whoami' \n"));
    console.log("[2.] Run a command against a discovered Tomcat Manager");
    console.log(color.blackBright("\n\t$> scout --ip=192.168.0.110 --target=tomcat --cmd='whoami' --creds='admin:password' \n"));

} else if (argv.u) {

    if (argv.cookie) {
        http.cookies(argv.cookie);
    }

    if (argv.input) {
        fs.readFile(argv.input, "utf8", function(err, data) {
            var payloadArray = data.toString().split('\n');
            var count = 1;
            var arrays = [];

            async.each(payloadArray, function(path, callback) {
                if (argv.string) {
                    http.get(argv.u, path, argv.string);
                } else {
                    http.get(argv.u, path);
                }

            })


        });
    } else {
        fs.readFile('./default.txt', "utf8", function(err, data) {
            var payloadArray = data.toString().split('\n');
            var count = 1;
            var arrays = [];

            async.each(payloadArray, function(path, callback) {
                if (argv.string) {
                    http.get(argv.u, path, argv.string);
                } else {
                    http.get(argv.u, path);
                }

            })


        });
    }



}
