# domain-finder

[domain-finder](https://github.com/myas92/domain-finder) is used to find, scan and collect available and unavailable domains;

If you spend more time for choosing the domain name, with this module you can quickly find a suitable name

NOTE: If you are from Iran, Cuba, Sudan, Syria, or North Korea, Please use a VPN or Proxy
## First Example ##

#### NOTE: domain name should be a word whitout numbers

```javascript
const domainFinder = require('domain-finder');

domainFinder({
    domainNames:["hello"],
    tlds: ["com","net"]
})
```

If `domainNames` be one word, it generates possible words, and check domain for possible words based on `tlds`

Possible words for `apple`
```
apple:  ["APPEL", "APPLE", "PEPLA", "LEAP", "PALE", "PALP", "PAPE", "PEAL", "PELA", "PLAP", "PLEA", "ALE",…]
```
### result ####
create a .txt file based on time, that all available and unavailable domains are stored

```
APPLE:

Available domains:
╔═════════════════╤═════════════════╤═══════════════╤════════════════╤═════════════════╤═════════════════╗
║ appledesai.com  │ applehashem.com │ applesaid.net │ applemalik.net │ appleabbas.net  │ appledesai.net  ║
╚═════════════════╧═════════════════╧═══════════════╧════════════════╧═════════════════╧═════════════════╝
Unavailable domains:
╔═══════════╤═══════════╗
║ apple.com │ apple.net ║
╚═══════════╧═══════════╝
------------------------------------------------------------------------------------------------------
````

## Second Example ##

If you want to check the domains of a series of specific words, just try like this

```javascript
const domainFinder = require('domain-finder');

domainFinder({
    domainNames:["hello","heloo"],
    tlds: ["com","net","org"]
})

```
## Third Example ##
If you want to find domains for a word with lower than 4 lengths, you should set `prefix` or `postfix`

```javascript
const domainFinder = require('domain-finder');

domainFinder({
    domainNames:["apple"],
    tlds: ["com","net"],
    prefix:"i",
    postfix:"coin"
})
```
## Fourth Example ##
If you want to find domains for a word with lower than 4 lengths, you should set `prefix` or `postfix`,
There are diffrenete status for prefix and post fix

`statusPrefix=0` that means if you set the `prefix` is ignored.
`statusPrefix=1` that means if just check domain for words with prefix.
`statusPrefix=2` that means if just check domain for words with prefix and none prefix.

`statusPostfix` is like the `statusPostfix`


If you don't set status for `statusPostfix` or `statusPostfix` default value is 5 that means check all conditions


```
statusPrefix=0, ["a","b"] => ["a", "b"]
statusPrefix=1, ["a","b"] => ["ia", "ib"]
statusPrefix=2, ["a","b"] => ["a", "b"] and ["ia", "ib"] 

statusPrefix=2, ["app"] => ["app", "apa"] => ["app", "apa"] 
statusPrefix=3, ["app"] => ["app", "apa"] => ["iapp", "iapa"] 
statusPrefix=4, ["app"] => ["app", "apa"] => ["app", "apa"] and ["iapp", "iapa"] 
-----------------------------------------------------------------------------------------
statusPostfix=0, ["a","b"] => ["a", "b"]
statusPostfix=1, ["a","b"] => ["ai", "bi"]
statusPostfix=2, ["a","b"] => ["a", "b"] and ["ai", "bi"] 

statusPostfix=2, ["app"] => ["app", "apa"] => ["app", "apa"] 
statusPostfix=3, ["app"] => ["app", "apa"] => ["appi", "apai"] 
statusPostfix=4, ["app"] => ["app", "apa"] => ["app", "apa"] and ["appi", "apai"];
-----------------------------------------------------------------------------------------

 (prefix=i && statusPrefix=5) &&(postfix= x && statusPostfix=5), 
["app"] => ["app", "apa"] => ["app", "apa"] and ["appx", "apax"]; and ["iapp","iapa"] and ["iappx", "iapax"]
```


```javascript
const domainFinder = require('domain-finder');

domainFinder({
    domainNames:["apple"],
    tlds: ["com","net"],
    prefix:"i",
    postfix:"coin"
    statusPrefix: 5,
    statusPostfix: 5
})
```

## Fifth Example ##

If you want to show the avialable and unavailable domains log into terminal use `consoleLog`

Default value for `consoleLog` is `false`
```javascript
const domainFinder = require('domain-finder');

domainFinder({
    domainNames:["hello","baby"],
    tlds: ["com","net","org"],
    consoleLog: true
})
```

#### result: ####

![alt text](https://github.com/mohammadyaser/domain-finder/blob/master/assets/result.png)




