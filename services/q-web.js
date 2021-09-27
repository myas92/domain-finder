const axios = require('axios');
const FormData = require('form-data');


class QWebService {
    async run(word) {
        if (word.length < 3) {
            throw new Error("length should be greater than 2")
        }
        let query = lexSearch(word, "", "scr", 0)
        var data = new FormData();
        data.append('lexjs', '1');
        data.append('lexjssql', query);
        data.append('suanki', word);
        data.append('sorgu_title', word);

        var config = {
            method: 'post',
            url: 'https://www.realqunb.com/wordfinder/lex.php',
            headers: {
                ...data.getHeaders()
            },
            data: data
        };
        try {
            let { data } = await axios(config)
            return { error: null, result: data.result }
        } catch (error) {
            return { error: error.message, result: null }
        }

    }

}


var __resultlimit = 1000;

function lexSearch(let, crit, method, len) {
    this.getLength = function (infld) {
        return infld.length;
    }
    this.getwordArray = function (word) {
        if (!word) return false;
        return word.split("");
    }
    this.errortxt = "";
    this.inLetter =
        let;
    this.letter =
        let.toUpperCase();
    this.inCriteria = crit;
    this.criteria = crit.toUpperCase();
    this.criteriaNW = crit.replace(/[*]/g, "").toUpperCase();
    this.inMethod = this.method = method;
    this.inLength = len;
    this.wildcard = 0;
    this.isValid = true;
    if (this.isValid) {
        if (this.getLength(this.inLetter) + this.getLength(this.inCriteria) < 3) {
            this.errortxt = '3 or more letters required for the search.';
            this.isValid = false;
        }
        if (this.isValid && this.getLength(this.inLetter) > 16) {
            this.errortxt = 'maximun number of input letters exceeded (16).';
            this.isValid = false;
        }
        if (this.isValid) {
            temptxt = this.inLetter + this.inCriteria;
            if (temptxt.replace(/[A-Za-z*]/g, "") > "") {
                this.errortxt = 'invalid character(s): ' + temptxt.replace(/[A-Za-z*]/g, "");
                this.isValid = false;
            }
        }
        if (this.isValid) {
            temptxt = this.letter;
            temptxt1 = temptxt.replace(/[A-Za-z]/g, "");
            if (temptxt1) {
                if (temptxt1 == "*" || temptxt1 == "**") {
                    if (temptxt1 == "**" && this.getLength(this.inLetter) > 7) {
                        this.errortxt = '2 wildcards allowed only for 5 letters and less';
                        this.isValid = false;
                    } else {
                        this.wildcard = temptxt1.length;
                        this.letter = temptxt.replace(/[*]/g, "").toUpperCase();
                    }
                } else {
                    this.errortxt = 'max number of wildcards exceeded (2)';
                    this.isValid = false;
                }
            }
        }
    }
    if (this.isValid) {
        var critL = crit1 = critLen = s = expL = expLen = exp1 = expl = '';
        if (this.letter) {
            getTheWordTree(this.letter, this.criteriaNW, this.wildcard);
            for (x in __wordPool) {
                s = s + __wordPool[x] + "','";
            }
            expL = '~ made up from letters: ' + this.inLetter;
            critL = " AND wordsort in ('" + s + "X') ";
        }
        if (this.inLength > 0) {
            expLen = '~ are  ' + this.inLength + ' chars long';
            critLen = " AND wlen= " + this.inLength;
        }
        switch (this.method) {
            case 'exp':
                crit1 = cmdGetExactPos(this.getwordArray(this.criteria));
                exp1 = '~ satisfy the exact pattern: ' + this.criteria;
                if (!crit1) {
                    crit1 = "";
                    exp1 = "";
                }
                break;
            case 'con':
                crit1 = this.criteria.replace(/[*]/g, "%");
                exp1 = '~ contain the pattern: ' + this.criteria + ' (loose)';
                if (!crit1) {
                    crit1 = "";
                    exp1 = "";
                } else {
                    crit1 = " AND word like '%" + crit1 + "%' ";
                }
                break;
            case 'sta':
                crit1 = this.criteria.replace(/[*]/g, "");
                exp1 = '~ start with the pattern: ' + crit1;
                if (!crit1) {
                    crit1 = "";
                    exp1 = "";
                } else {
                    crit1 = " AND word like '" + crit1 + "%' ";
                }
                break;
            case 'end':
                crit1 = this.criteria.replace(/[*]/g, "");
                exp1 = '~ end with the pattern: ' + crit1;
                if (!crit1) {
                    crit1 = "";
                    exp1 = "";
                } else {
                    crit1 = " AND word like '%" + crit1 + "' ";
                }
                break;
            case 'scr':
                crit1 = this.criteria.replace(/[*]/g, "%");
                exp1 = '~ contain the pattern: ' + this.criteria + ' (loose)';
                if (!crit1) {
                    crit1 = "";
                    exp1 = "";
                } else {
                    crit1 = " AND word like '%" + crit1 + "%' ";
                }
                break;
            default:
                this.errortxt = 'wrong search method';
                this.isValid = false;;
        }
    }
    if (this.isValid) {
        this.query = "SELECT word, wlen FROM sowpods WHERE 1=1 " + critLen + critL + crit1 + " ORDER BY wlen desc, word LIMIT " + __resultlimit;
        expl = "search in dictionary for words that: ";
        if (expL) expl += expL;
        if (exp1) expl += exp1;
        if (expLen) expl += expLen;
        this.qryExplain = expl;
        this.logReq = this.method + '-' + this.inLetter + '-' + this.inLength + '-' + this.inCriteria;
        return this.query
    }
    var __wordPool = new Array;

    function getTheWordTreeExtra(word, extra) {
        var y = word + "",
            nw = "",
            l = "",
            wA, w, e;
        w = y.split("").sort().join("");
        if (extra) {
            if (w.length + extra.length < 3 || w.length > 16) return false;
            nw = w.concat(extra).split("").sort().join("");
        } else {
            if (w.length < 3 || w.length > 16) return false;
            nw = w;
        }
        if (__wordPool[nw]) return false;
        __wordPool[nw] = nw;
        wA = w.split("");
        for (x in wA) {
            l = "";
            f = 0;
            for (y in wA) {
                if (wA[y] != wA[x]) {
                    l = l + wA[y];
                } else {
                    f++;
                    if (f > 1) {
                        l = l + wA[y];
                    }
                }
            }
            getTheWordTreeExtra(l, extra);
        }
        return true;
    }

    function getTheWordTree(word, extra, card) {
        __wordPool = [];
        if (!card || (card != 1 && card != 2)) {
            v = getTheWordTreeExtra(word, extra);
        } else {
            var abc = "ABCDEFGHIJKLMNOPQRSTUVWYZ";
            var abcA = abc.split("");
            if (card == 1) {
                for (a in abcA) {
                    v = getTheWordTreeExtra(word.concat(abcA[a]).split("").sort().join(""), extra);
                }
            }
            if (card == 2) {
                for (a in abcA) {
                    for (b in abcA) {
                        v = getTheWordTreeExtra(word.concat(abcA[a], abcA[b]).split("").sort().join(""), extra);
                    }
                }
            }
        }
        return v;
    }

    function cmdGetExactPos(wd_arr) {
        var out = " ";
        if (wd_arr) {
            for (i = 0; i < wd_arr.length; i++) {
                if (wd_arr[i] != "*") {
                    out += " AND Substring(word," + (i + 1) + ",1)='" + wd_arr[i] + "' ";
                }
            }
            return out;
        }
    }
}


module.exports = new QWebService()