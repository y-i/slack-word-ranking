const config = require('config');
const Mecab = require('./mecab');

module.exports = (robot) => {
  const mecab = new Mecab();
  robot.hear('mecab: (.+)', (msg) => {
    if (msg.match.length !== 2) {
      msg.send('Invalid message format: "mecab: (.+)"');
      return;
    }
    const text = msg.match[1];
    const result = mecab.parse(text);
    msg.send(result);
  });
};
