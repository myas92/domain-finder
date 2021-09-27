
const async = require('async');
const q = require('q');
const FinderWords = require('./finder-words');
const GoogleWeb = require('./services/google.web');
const { Table } = require('console-table-printer');
const table = require('table').table;
const fs = require('fs');;
class BusinessLogic {
    constructor() {
        this.finderWords = new FinderWords();
    }
    async process({ domainNames, tlds }) {
        let domains;
        if (domainNames.length == 1)
            domains = await this.finderWords.find(domainNames[0])
        else {
            domains = domainNames
        }

        let urls = await this.getUrls(domains)
        let allParsedUrls =  this.saveUrls(urls, tlds)
        return allParsedUrls
    }

    async getUrls(domains) {
        let defer = q.defer()
        let googleUrls = []
        async.eachSeries(domains, async (domain) => {
            try {
                let { error, result } = await GoogleWeb.run();
                if (error) {
                    console.log(error.message)
                }
                else if (result) {
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

    async saveUrls(allUrls, tlds) {
        let fileName = +new Date()
        let validInvalidUrls = []
        for (let domians of allUrls) {
            let processedUrls = this.extractValidAndInvalidUrls(domians.domainName, domians.urls, tlds, fileName)
            validInvalidUrls.push(processedUrls)
            //await this.saveUrlsToFile(processedUrls)
        }
        return validInvalidUrls
    }

    extractValidAndInvalidUrls(domainName, urls, tlds,fileName) {
        let validResult = [];
        let invalidResult = [];
        const p = new Table();
        // let counter = 1;
        try {
            for (let i = 0; i < urls.length; i++) {
                if (tlds.includes(urls[i].domainName.tld)) {
                    if (urls[i].supportedResultInfo.availabilityInfo.availability.includes("AVAILABILITY_UNAVAILABLE")) {
                        if (!invalidResult[urls[i].domainName.tld]) invalidResult[urls[i].domainName.tld] = []
                        let fullDomain = `${urls[i].domainName.sld}.${urls[i].domainName.tld}`
                        invalidResult[urls[i].domainName.tld].push(fullDomain);
                        // p.addRow({ index: counter, domain: fullDomain }, { color: 'red' });
                        // counter += 1
                    }
                    else {
                        if (!validResult[urls[i].domainName.tld]) validResult[urls[i].domainName.tld] = []
                        let fullDomain = `${urls[i].domainName.sld}.${urls[i].domainName.tld}`
                        validResult[urls[i].domainName.tld].push(`${urls[i].domainName.sld}.${urls[i].domainName.tld}`);
                        // p.addRow({ index: counter, domain: fullDomain }, { color: 'green' });
                        // counter += 1
                    }
                }
            }

            // let count = 1;
            // for (let key in validResult) {
            //     validResult[key].forEach(item => {
            //         p.addRow({ index: count, domain: item }, { color: 'green' });
            //         count += 1
            //     })
            // }
            // for (let key in invalidResult) {
            //     invalidResult[key].forEach(item => {
            //         p.addRow({ index: count, domain: item }, { color: 'red' });
            //         count += 1
            //     })
            // }
            // console.log('\x1b[36m%s\x1b[0m', domainName)
            // p.printTable();



            let dataValid = [];
            let dataInvalid = [];
            for (let key in validResult) {
                validResult[key].forEach(item => {
                    dataValid.push(item)

                })
            }
            for (let key in invalidResult) {
                invalidResult[key].forEach(item => {
                    dataInvalid.push(item)
                })
            }
            let outputValid = table([dataValid]);
            let outputInvalid = table([dataInvalid]);

            fs.appendFileSync(`${fileName}.txt`,`${domainName}:\r\n\n` )
            fs.appendFileSync(`${fileName}.txt`,`Available domains:\r\n` )
            fs.appendFileSync(`${fileName}.txt`,outputValid )
            fs.appendFileSync(`${fileName}.txt`,`Unvailable domains:\r\n` )
            fs.appendFileSync(`${fileName}.txt`,`${outputInvalid}` )
            fs.appendFileSync(`${fileName}.txt`,`------------------------------------------------------------------------------------------------------\n` )
            // const CreateFiles = fs.createWriteStream('./file.txt', {
            //     flags: 'a' //flags: 'a' preserved old data
            // })
            //  CreateFiles.write(domainName + '\r\n')
            //  CreateFiles.write(outputValid + '\r')
            //  CreateFiles.write(outputInvalid + '\r')
            // fs.writeFile("tabledata.txt", output, "utf8", function (err) {
            //     if (err) {
            //         return console.log(err);
            //     }

            //     console.log("The file was saved!");
            // });
            return { validResult, invalidResult }
        } catch (error) {
            console.log(error)
        }

    }

    async saveUrlsToFile(processedUrls) {

        console.log(processedUrls);
    }


}


module.exports = new BusinessLogic()