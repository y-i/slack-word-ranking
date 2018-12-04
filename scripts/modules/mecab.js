const Mecab = require('mecab-async');

class MecabParser {
  constructor() {
    this._mecab = new Mecab();
    // this._mecab.command = '/usr/local/bin/mecab -d /usr/lib/mecab/dic/mecab-ipadic-neologd';
    this._mecab.options = {
      timeout: 10000,
    };
  }
  parse(text) {
    return new Promise((resolve, reject) => {
      this._mecab.parse(text, (err, res) => {
        if (err) return reject(err);
        else return resolve(res);
      });
    });
  }
}

module.exports = MecabParser;
