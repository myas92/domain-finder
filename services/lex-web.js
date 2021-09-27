const axios = require('axios');
const qs = require('qs');


class LexWeb {
    async run(word) {

        var data = qs.stringify({
            'sletter': '',
            'wordcriteria': word,
            'Wlenid': '0',
            'lexid': '1',
            'Stype': '4',
            'idmode': '5',
            'viewid': '0',
            'innerAction_id': '',
            'version_id': '0'
        });
        var config = {
            method: 'post',
            url: 'http://lexsearch.net/lexajax.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            timeout: 10 * 1000 // 10 seconds
        };
        try {
            let response = await axios(config)
            let res = response.data.substring(
                response.data.indexOf("<td>") + 4,
                response.data.lastIndexOf("</td>")
            );
            let words = res.trim().split(' ')
            return { error: null, result: words }
        } catch (error) {
            return { error: error.message, result: null }
        }

    }

}

module.exports = new LexWeb()