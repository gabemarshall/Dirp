var fs  = require("fs");


var argv = require('yargs').argv

exports.load = function(){
	var payloadArray;

	if (argv.input){
		console.log("Loading custom wordlist %s", argv.input);
		payloadArray = fs.readFileSync(argv.input, 'utf8').toString().split('\n');
	} else {
		console.log("Using default wordlist");
		payloadArray = fs.readFileSync('./default.txt', 'utf8').toString().split('\n');
	}
	
	
	return payloadArray;
}