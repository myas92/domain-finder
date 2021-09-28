const BL = require('./business-logic');


//statusPrefix=0, ["a","b"] => ["a", "b"]
//statusPrefix=1, ["a","b"] => ["ia", "ib"]
//statusPrefix=2, ["a","b"] => ["a", "b"] and ["ia", "ib"] 

//statusPrefix=2, ["app"] => ["app", "apa"] => ["app", "apa"] 
//statusPrefix=3, ["app"] => ["app", "apa"] => ["iapp", "iapa"] 
//statusPrefix=4, ["app"] => ["app", "apa"] => ["app", "apa"] and ["iapp", "iapa"] 
//-----------------------------------------------------------------------------------------
//statusPostfix=0, ["a","b"] => ["a", "b"]
//statusPostfix=1, ["a","b"] => ["ai", "bi"]
//statusPostfix=2, ["a","b"] => ["a", "b"] and ["ai", "bi"] 

//statusPostfix=2, ["app"] => ["app", "apa"] => ["app", "apa"] 
//statusPostfix=3, ["app"] => ["app", "apa"] => ["appi", "apai"] 
//statusPostfix=4, ["app"] => ["app", "apa"] => ["app", "apa"] and ["appi", "apai"];
//-----------------------------------------------------------------------------------------

// (prefix=i && statusPrefix=5) &&(postfix= x && statusPostfix=5), 
//["app"] => ["app", "apa"] => ["app", "apa"] and ["appx", "apax"]; and ["iapp","iapa"] and ["iappx", "iapax"]
//, ["app"] => ["app", "apa"] => ["app", "apa"] and ["appi", "apai"];

async function run({ domainNames, tlds, prefix = "", postfix = "", consoleLog = false, statusPrefix = 5, statusPostfix = 5 }) {
    let validationMessages = validateInputs({ domainNames, tlds, prefix, postfix, consoleLog, statusPrefix, statusPostfix })
    if (validationMessages.length > 0) {
        console.log(validationMessages);
        return []
    }
    let { validInvalidUrls, fileName } = await BL.process({ domainNames, tlds, prefix, postfix, consoleLog, statusPrefix, statusPostfix })
    console.log(`Please check ${fileName}.txt`);
    return validInvalidUrls
}
function validateInputs({ domainNames, tlds, prefix, postfix, consoleLog, statusPrefix, statusPostfix }) {
    let messages = []
    if (!Number.isInteger(statusPrefix) || statusPrefix > 5) {
        messages.push("statusPrefix value is invalid, select a number between [0-5]")
    }
    if (!Number.isInteger(statusPostfix) || statusPostfix > 5) {
        messages.push("statusPostfix value is invalid, select a number between [0-5]")
    }
    return messages
}
module.exports = run;