
const async = require('async');
const q = require('q');
const FinderWords = require('./services/finder-words');
const GoogleWeb = require('./services/google.web');
const { Table } = require('console-table-printer');
const table = require('table').table;
const fs = require('fs');;
class BusinessLogic {
    constructor() {
        this.finderWords = new FinderWords();
    }
    async process({ domainNames, tlds, consoleLog, prefix, postfix, statusPrefix, statusPostfix }) {
        let defer = q.defer()
        let initDomains;
        if (domainNames.length == 1)
            initDomains = await this.finderWords.find(domainNames[0])
        else {
            initDomains = domainNames
        }
        let parsedDomain = this.setPostfixPrefixDomain({ domains: initDomains, prefix, postfix, statusPrefix, statusPostfix })
        const reversedParsedDomain = parsedDomain.reverse()
        let domainsChunk = [];
        const size = 20;
        let result = []
        while (reversedParsedDomain.length > 0)
            domainsChunk.push(reversedParsedDomain.splice(0, size));
        async.eachOfSeries(domainsChunk, async (domians, index) => {
            try {
                let urls = await this.getUrlsFromGoogle({ domains: domians, prefix, postfix, statusPrefix, statusPostfix, counter: index, size })
                let allParsedUrls = await this.saveUrls(urls, tlds, consoleLog);
                console.log(`Please check ${allParsedUrls.fileName}.txt`);
                result.push(allParsedUrls)
            } catch (error) {
                console.log(error.message);
            }
        }, () => {
            defer.resolve(allParsedUrls)
        })

        return defer.promise;
    }
    setPostfixPrefixDomain({ domains, prefix, postfix, statusPrefix, statusPostfix }) {

        let result = []
        if (statusPrefix == 5 && statusPostfix == 5) {
            domains.forEach(item => {
                if (`${prefix}${item}`.length > 3)
                    result.push(`${prefix}${item}`)
                if (item.length > 3)
                    result.push(`${item}`)
                if (`${item}${postfix}`.length > 3)
                    result.push(`${item}${postfix}`)
                if (`${prefix}${item}${postfix}`.length > 3)
                    result.push(`${prefix}${item}${postfix}`)

            })
        }
        if (prefix) {
            if (statusPrefix == 0) {
                domains.forEach(item => {
                    if (item.length > 3)
                        result.push(`${item}`)
                })
            }

            if (statusPrefix == 1) {
                domains.forEach(item => {
                    result.push(`${prefix}${item}`)
                })
            }

            if (statusPrefix == 2) {
                domains.forEach(item => {
                    if (item.length > 3)
                        result.push(`${item}`)
                    result.push(`${prefix}${item}`)
                })
            }
        }
        if (postfix) {
            if (statusPostfix == 0) {
                domains.forEach(item => {
                    if (item.length > 3)
                        result.push(`${item}`)
                })
            }

            if (statusPostfix == 1) {
                domains.forEach(item => {
                    result.push(`${item}${postfix}`)
                })
            }

            if (statusPostfix == 2) {
                domains.forEach(item => {
                    if (item.length > 3)
                        result.push(`${item}`)
                    result.push(`${item}${postfix}`)
                })
            }
        }
        let uniqeDomain = [...new Set(result)]

        return uniqeDomain
    }
    async getUrlsFromGoogle({ domains, prefix, postfix, statusPrefix, statusPostfix, counter, size }) {
        let defer = q.defer()
        let googleUrls = []
        async.eachOfSeries(domains, async (domain, index) => {
            try {
                console.log(`${index + (counter) * size}:${domain.toLowerCase()}`);
                const { error, result } = await GoogleWeb.run(domain);
                if (error) {
                    console.log(error.message)
                }
                if (result) {
                    let obj = { domainName: domain, urls: result }
                    googleUrls.push(obj)
                }
            } catch (error) {
                console.log(error.message)
            }
        }, () => {
            defer.resolve(googleUrls)
        })

        return defer.promise;

    }

    async saveUrls(allUrls, tlds, consoleLog) {
        let fileName = +new Date()
        let validInvalidUrls = []

        for (let domians of allUrls) {
            let { domainName, urls } = domians
            let { validResult, invalidResult } = this.extractValidAndInvalidUrls({ urls, tlds })

            if (consoleLog)
                this.logUrlsInTerminal({ domainName, validResult, invalidResult })

            await this.saveUrlsToFile({ validResult, invalidResult, fileName, domainName })
            validInvalidUrls.push({ validResult, invalidResult })
        }
        return { validInvalidUrls, fileName }
    }

    extractValidAndInvalidUrls({ urls, tlds }) {
        let validResult = [];
        let invalidResult = [];

        try {
            for (let i = 0; i < urls.length; i++) {
                if (tlds.includes(urls[i].domainName.tld)) {
                    if (urls[i].supportedResultInfo.availabilityInfo.availability.includes("AVAILABILITY_UNAVAILABLE")) {
                        if (!invalidResult[urls[i].domainName.tld]) invalidResult[urls[i].domainName.tld] = []
                        let fullDomain = `${urls[i].domainName.sld}.${urls[i].domainName.tld}`
                        invalidResult[urls[i].domainName.tld].push(fullDomain);

                    }
                    else {
                        if (!validResult[urls[i].domainName.tld]) validResult[urls[i].domainName.tld] = []
                        let fullDomain = `${urls[i].domainName.sld}.${urls[i].domainName.tld}`
                        validResult[urls[i].domainName.tld].push(fullDomain);

                    }
                }
            }
            return { validResult: validResult, invalidResult: invalidResult }
        } catch (error) {
            console.log(error)
        }

    }

    logUrlsInTerminal({ domainName, validResult, invalidResult }) {
        const p = new Table();
        let count = 1;
        for (let key in validResult) {
            validResult[key].forEach(item => {
                p.addRow({ index: count, domain: item }, { color: 'green' });
                count += 1
            })
        }
        for (let key in invalidResult) {
            invalidResult[key].forEach(item => {
                p.addRow({ index: count, domain: item }, { color: 'red' });
                count += 1
            })
        }
        console.log('\x1b[36m%s\x1b[0m', domainName)
        p.printTable();
    }

    async saveUrlsToFile({ validResult, invalidResult, fileName, domainName }) {
        try {
            let dataValid;
            let dataInvalid;
            let outputValid;
            let outputInvalid;
            dataValid = this.processValidInvalidUrls(validResult);
            dataInvalid = this.processValidInvalidUrls(invalidResult);

            fs.appendFileSync(`${fileName}.txt`, `${domainName}:\r\n\n`);
            fs.appendFileSync(`${fileName}.txt`, `Available domains:\r\n`);

            if (dataValid.length != 0) {
                outputValid = table([dataValid]);
                fs.appendFileSync(`${fileName}.txt`, outputValid)
            }

            fs.appendFileSync(`${fileName}.txt`, `Unvailable domains:\r\n`)

            if (dataInvalid.length != 0) {
                outputInvalid = table([dataInvalid]);
                fs.appendFileSync(`${fileName}.txt`, `${outputInvalid}`)
            }
            fs.appendFileSync(`${fileName}.txt`, `--------------------------------------------------------------------------------------------\n`)
        } catch (error) {
            console.log("saveUrlsToFile:", error.message);
        }
    }
    processValidInvalidUrls(urls) {
        let result = []
        for (let key in urls) {
            urls[key].forEach(item => {
                result.push(item)
            })
        }
        return result
    }

}


module.exports = new BusinessLogic()