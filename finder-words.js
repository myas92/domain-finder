const QWeb = require('./services/q-web');
const LexWeb = require('./services/lex-web');


class FinderWords {
    constructor() {
    }
    async find(word) {
        let wordsList = await this.sendRequest("lexWeb", word)
        if (wordsList?.error || !wordsList?.result) {
            wordsList = await this.sendRequest("qWeb", word)
            if (wordsList.error) {
                throw new Error("Access Error to the website", wordsList.error)
            }
        }
        console.log("------Finish Process------");
        return wordsList?.result ? wordsList.result : [inputWord]
    }

    async sendRequest(webSite, words) {
        let result;
        if (webSite == "qWeb") {
            result = await QWeb.run(words)
        }
        else if (webSite == "lexWebs") {
            result = await LexWeb.run(words);
        }
        return result;
    }
}
module.exports = FinderWords