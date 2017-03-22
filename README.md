# No longer supported, check out a much better & less buggy replacement called [GoBuster](https://github.com/OJ/gobuster)

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

Enumerate a url, increase the speed by using more concurrent sockets.
```
./dirp -u 'https://foo.bar/' --rate=1000 (default is 500)
```

Point dirp at a proxy (burp, corporate proxy, etc)
```
./dirp -u 'https://foo.bar/' --proxy='http://proxy.host:port'
```
