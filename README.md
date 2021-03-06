# Dirp
A simplistic but fast Web Content Scanner written in nodejs.


### Usage
Enumerate a url using the built-in wordlist.
```
./dirp.js -u 'https://foo.bar/'
```

Enumerate a url using a custom wordlist and a custom insertion point
```
./dirp -u 'https://foo.bar/<INSERT>.php' --wordlist=/path/to/phpwordlist.txt
```

Enumerate an application post auth (uses same syntax as SQLMap)

```
./dirp -u 'https://foo.bar/' --cookie='sessionid=12345;foo=bar;'
```

Enumerate a url, increase the max requests per second
```
./dirp -u 'https://foo.bar/' --rate=50 (default is 15)
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

Force Dirp to continue despite errors in connecting

```
--force
```
