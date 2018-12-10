const config = require('config');
const Mecab = require('./modules/mecab');
const mysql = require('mysql');

const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return [year, month, day].join('-');
}

module.exports = (robot) => {
  const mecab = new Mecab();
  const connection = mysql.createConnection({
    host: config.get('mysql.host'),
    port: config.get('mysql.port'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    database: config.get('mysql.database'),
  });
  connection.connect();

  robot.hear(/(.....+)/, async (msg) => {
    if (msg.match.length !== 2) {
      msg.send('Invalid message format: "mecab: (.+)"');
      return;
    }
    const text = msg.match[1];
    try {
      const result = await mecab.parse(text);
      /*
      let message = '';
      message += '名詞: ';
      message += result.filter(el => el[1] === '名詞').map(el => el[0]).join(', ');
      message += '\n';
      message += '動詞: ';
      message += result.filter(el => el[1] === '動詞').map(el => el[0]).join(', ');
      message += '\n';
      message += '助動詞: ';
      message += result.filter(el => el[1] === '助動詞').map(el => el[0]).join(', ');
      message += '\n';
      message += '副詞: ';
      message += result.filter(el => el[1] === '副詞').map(el => el[0]).join(', ');
      message += '\n';
      message += '形容詞: ';
      message += result.filter(el => el[1] === '形容詞').map(el => el[0]).join(', ');
      message += '\n';
      message += '形容動詞: ';
      message += result.filter(el => el[1] === '形容動詞').map(el => el[0]).join(', ');
      message += '\n';
      message += '連体詞: ';
      message += result.filter(el => el[1] === '連体詞').map(el => el[0]).join(',');
      message += '\n';
      msg.send(message);
      */
      // insert into aggregation (word, type, count, day) values (?,名詞,1,?) where word = ? and type = 名詞 and day = ? ON DUPLICATE KEY UPDATE count = count + 1;
      result.filter(el => el[1] === '名詞').map(el => el[0]).forEach(el => {
        connection.query('insert into aggregation (word, type, count, day) values (?,"名詞",1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [el, formatDate()], (error, results, fields) => {
          if (error) console.log(error);
        });
      });
      result.filter(el => el[1] === '動詞').map(el => el[0]).forEach(el => {
        connection.query('insert into aggregation (word, type, count, day) values (?,"動詞",1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [el, formatDate()], (error, results, fields) => {
          if (error) console.log(error);
        });
      });
      result.filter(el => el[1] === '助動詞').map(el => el[0]).forEach(el => {
        connection.query('insert into aggregation (word, type, count, day) values (?,"助動詞",1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [el, formatDate()], (error, results, fields) => {
          if (error) console.log(error);
        });
      });
      result.filter(el => el[1] === '副詞').map(el => el[0]).forEach(el => {
        connection.query('insert into aggregation (word, type, count, day) values (?,"副詞",1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [el, formatDate()], (error, results, fields) => {
          if (error) console.log(error);
        });
      });
      result.filter(el => el[1] === '形容詞').map(el => el[0]).forEach(el => {
        connection.query('insert into aggregation (word, type, count, day) values (?,"形容詞",1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [el, formatDate()], (error, results, fields) => {
          if (error) console.log(error);
        });
      });
      result.filter(el => el[1] === '形容動詞').map(el => el[0]).forEach(el => {
        connection.query('insert into aggregation (word, type, count, day) values (?,"形容動詞",1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [el, formatDate()], (error, results, fields) => {
          if (error) console.log(error);
        });
      });
      result.filter(el => el[1] === '連体詞').map(el => el[0]).forEach(el => {
        connection.query('insert into aggregation (word, type, count, day) values (?,"連体詞",1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [el, formatDate()], (error, results, fields) => {
          if (error) console.log(error);
        });
      });
    } catch (e) {
      msg.send(`Error: ${e}`);
    }
  });

  robot.respond(/ranking/, (msg) => {
    connection.query('select word, type, sum(count) as count from aggregation where day >= ? - interval 1 day and char_length(word) >= 2 and word != "ranking" and word != "mecab" group by word, type order by count desc limit 10', [formatDate()], (error, results, fields) => {
      if (error) console.log(error);
      const res = results.map(row => `${row.count}: ${row.word} (${row.type})`);
      msg.send('*昨日からのランキング*\n' + res.join('\n'));
    });
    connection.query('select word, type, sum(count) as count from aggregation where day >= ? - interval 7 day and char_length(word) >= 2 and word != "ranking" and word != "mecab" group by word, type order by count desc limit 10', [formatDate()], (error, results, fields) => {
      if (error) console.log(error);
      const res = results.map(row => `${row.count}: ${row.word} (${row.type})`);
      msg.send('*一週間のランキング*\n' + res.join('\n'));
    });
  });
};
