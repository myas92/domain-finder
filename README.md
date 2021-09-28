# domian-finder


If you spend more time for choosing the domain name, with this module you can quickly find a suitable name for own

## First Example ##

#### NOTE: domain name should be a word whitout numbers

```
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
╔═══════════════╤═════════════════╤═════════════════╤═══════════════╤════════════════╤═════════════════╤═════════════════╗
║  apple.com    │ appledesai.com  │ applehashem.com │ applesaid.net │ applemalik.net │ appleabbas.net  │ appledesai.net  ║
╚═══════════════╧═════════════════╧═════════════════╧═══════════════╧════════════════╧═════════════════╧═════════════════╝
Unavailable domains:
╔═══════════╤═══════════╗
║ apple.com │ apple.net ║
╚═══════════╧═══════════╝
------------------------------------------------------------------------------------------------------
````

## Second Example ##

if you want for check the domains of a series of specefic words, just try like this

```
const domainFinder = require('domain-finder');

domainFinder({
    domainNames:["hello","heloo"],
    tlds: ["com","net","org"]
})

```
## Third Example ##
If you want to find domains for a word with lower than 4 length, you should set `prefix` or `postfix`

```
const domainFinder = require('domain-finder');

domainFinder({
    domainNames:["apple"],
    tlds: ["com","net"],
    prefix:"i",
    postfix:"coin"
})
```
