class Parser {
  constructor() {
  }
  parse(text) {
    return new Promise((resolve, reject) => {
      return this._parse(resolve, reject, text);
    });
  }
  _parse(resolve, reject, text) {

  }
}

module.exports = Parser;
