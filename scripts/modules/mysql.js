const config = require('config');
const mysql = require('mysql');

class Mysql {
  constructor() {
    const mysqlConfig = {
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
    };
    if (process.env.NODE_ENV === 'production') {
      mysqlConfig.socketPath = `/cloudsql/${process.env.MYSQL_CONNECTION_NAME}`;
    } else {
      mysqlConfig.host = process.env.MYSQL_HOST;
    }
    this._connection = mysql.createConnection(mysqlConfig);
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
      this._connection.query(`select word, type, sum(count) as count from aggregation where day >= ? - interval ${duration} day group by word, type order by count desc limit ${number}`, [date], (error, results) => {
        if (error) reject(error);
        return resolve(results);
      });
    });
  }
}

module.exports = Mysql;
