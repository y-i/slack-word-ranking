const Parser = require('./parser');
const config = require('config');
const Mecab = require('mecab-async');

// 実行にはローカル内にMeCabが必要
class MecabParser extends Parser {
  constructor() {
    super();
    this._mecab = new Mecab();
    // this._mecab.command = '/usr/local/bin/mecab -d /usr/lib/mecab/dic/mecab-ipadic-neologd';
    this._mecab.options = {
      timeout: 10000,
    };
    this._types = config.get('mecab.types');
  }
  _parse(resolve, reject, text) {
    this._mecab.parse(text, (err, res) => {
      if (err) return reject(err);
      else return resolve(res.map(elem => {
        return {
          word: elem[0],
          type: elem[1],
        };
      }).filter(elem => this._types.includes(elem.type)));
    });
  }
}

module.exports = MecabParser;
