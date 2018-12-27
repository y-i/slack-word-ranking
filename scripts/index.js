const Cotoha = require('./modules/cotoha');
const Mecab = require('./modules/mecab');
const Mysql = require('./modules/mysql');
const config = require('config');

const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return [year, month, day].join('-');
}

module.exports = (robot) => {
  require('dotenv').config();
  const parser = new Cotoha();
  const mysql = new Mysql();
  mysql.connect();

  const myname = config.get('name');

  robot.hear(/(.....+)/, async (msg) => {
    // 自分宛のメンションが含まれる場合は無視
    if (msg.message.mentions.some(mention => mention.info.name === myname)) return;
    if (msg.match.length !== 2) {
      msg.send('Invalid message format: "mecab: (.+)"');
      return;
    }
    const text = msg.match[1];
    try {
      const today = formatDate();
      const result = await parser.parse(text);

      result.forEach(el => mysql.add(el.word, el.type, today));
    } catch (e) {
      msg.send(`Error: ${e}`);
    }
  });

  robot.respond(/ranking/, async (msg) => {
    const createRankingRow = (row, index) => {
      return `${index+1}: ${row.word} (${row.type}) (${row.count}pt.)`;
    };
    const ranking1day = await mysql.fetchRanking(1, 10, formatDate());
    msg.send('*昨日からのランキング*\n' + ranking1day.map(createRankingRow).join('\n'));
    const ranking7day = await mysql.fetchRanking(7, 10, formatDate());
    msg.send('*一週間のランキング*\n' + ranking7day.map(createRankingRow).join('\n'));
  });
};
