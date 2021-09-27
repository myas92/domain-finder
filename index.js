const BL = require('./business-logic');



async function run({domainNames, tlds}){
    let result = await BL.process({domainNames, tlds})
    return result
}

module.exports = run;