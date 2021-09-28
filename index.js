const BL = require('./business-logic');



async function run({ domainNames, tlds, prefix = "", postfix = "" }) {
    let {validInvalidUrls ,fileName } = await BL.process({ domainNames, tlds, prefix, postfix })
    console.log(`Please check ${fileName}.txt`);
    return validInvalidUrls
}

module.exports = run;