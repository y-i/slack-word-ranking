const Parser = require('./parser');
const config = require('config');
const fetch = require('isomorphic-fetch');

class CotohaParser extends Parser {
  constructor() {
    super();
    this._types = config.get('cotoha.types');
  }
  _parse(resolve, reject, text) {
    this._getAccessToken().then(() => {
      fetch(process.env.COTOHA_BASE_API + '/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'charset': 'UTF-8',
          'Authorization': `Bearer ${this._accessToken}`,
        },
        body: JSON.stringify({
          'sentence': text,
        }),
      }).then(res => {
        if (res.status !== 200) reject(`Invalid status: ${res.status}`);
        return res;
      }).then(res => res.json()).then(res => res.result).then(res => {
        return res.reduce((ary, elem) => {
          ary.push(...elem.tokens);
          return ary;
        }, []).filter(elem => this._types.includes(elem.pos)).map(elem => {
          return {
            word: elem.lemma,
            type: elem.pos,
          };
        });
      }).then(res => resolve(res));
    });
  }
  async _getAccessToken() {
    await fetch(process.env.COTOHA_ACCESS_TOKEN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'charset': 'UTF-8',
      },
      body: JSON.stringify({
        "grantType": "client_credentials",
        "clientId": process.env.COTOHA_CLIENT_ID,
        "clientSecret": process.env.COTOHA_CLIENT_SECRET,
      }),
    }).then(res => res.json()).then(res => {
      this._accessToken = res['access_token'];
    });
  }
}

module.exports = CotohaParser;
