const axios = require('axios');
const async = require('async');
const qs = require('qs');


class GoogleWeb {
    async run(word) {

        try {
            let data = JSON.stringify({
                "clientFilters": {},
                "clientUserSpec": {
                    "countryCode": "US",
                    "currencyCode": "USD"
                },
                "debugType": "DEBUG_TYPE_NONE",
                "query": word
            });

            let config = {
                method: 'post',
                url: 'https://domains.google.com/v1/Main/FeSearchService/Search',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data
            };

            let response = await axios(config)
            let initialUrls = JSON.parse(response.data.split('\n')[2]);
            let doamins = initialUrls.searchResponse.results.result;

            // let doamins = response.searchResponse.results.result;
           
            return { error: null, result: doamins }
        } catch (error) {
            if(error.message == "Request failed with status code 403"){
                console.log("If you are connected from Iran, Cuba, Sudan, Syria, or North Korea, Please use a VPN or Proxy")
            }
            return { error: error.message, result: null }
        }

    }

}

module.exports = new GoogleWeb()