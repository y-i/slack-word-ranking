const config = require('config');
const mysql = require('mysql');

class Mysql {
  constructor() {
    this._connection = mysql.createConnection({
      host: config.get('mysql.host'),
      port: config.get('mysql.port'),
      user: config.get('mysql.user'),
      password: config.get('mysql.password'),
      database: config.get('mysql.database'),
    });
  }
  connect() {
    this._connection.connect();
  }
  add(word, type, date) {
    return new Promise((resolve, reject) => {
      this._connection.query('insert into aggregation (word, type, count, day) values (?,?,1,?) ON DUPLICATE KEY UPDATE count = count + 1;', [word, type, date], (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }
  fetchRanking(duration, number, date) {
    return new Promise((resolve, reject) => {
      this._connection.query(`select word, type, sum(count) as count from aggregation where day >= ? - interval ${duration} day and char_length(word) >= 2 and word != "ranking" and word != "mecab" group by word, type order by count desc limit ${number}`, [date], (error, results) => {
        if (error) reject(error);
        return resolve(results);
      });
    });
  }
}

module.exports = Mysql;
