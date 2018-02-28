# Dirp
A simplistic but fast Web Content Scanner written in nodejs.


### Usage
Enumerate a url using the built-in wordlist.
```
./dirp.js -u 'https://foo.bar/'
```

Enumerate a url using a custom wordlist.
```
./dirp -u 'https://foo.bar/' --input=/path/to/wordlist.txt
```

Enumerate an application post auth (uses same syntax as SQLMap)

```
./dirp -u 'https://foo.bar/' --cookie='sessionid=12345;foo=bar;'
```

Enumerate a url, increase the max requests per second
```
./dirp -u 'https://foo.bar/' --rate=500 (default is 100)
```

Point dirp at a proxy (burp, corporate proxy, etc)
```
./dirp -u 'https://foo.bar/' --proxy='http://proxy.host:port'
```

### Misc features

Enumerate a url using alternate an HTTP method (OPTIONS, POST, etc)

```
--method OPTIONS
```

Use custom status code to indiciate an existing file

```
--status 404

--status 404 --method OPTIONS  # Chaining these together has been useful in locating files when a web server "lies"
```

Use a custom regex string to indicate a file exists

```
--string=foobar
```

Enable debug mode

```
--debug
```
