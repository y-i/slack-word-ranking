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
  _query(...args) {
    return new Promise((resolve, reject) => {
      this._connection.query(...args, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
  add(word, type, date) {
    return this._query(
      'insert into aggregation (word, type, count, day) ' +
      'values (?,?,1,?) ON DUPLICATE KEY UPDATE count = count + 1;',
      [word, type, date]
    );
  }
  fetchRanking(duration, number, date) {
    return this._query(
      `select word, type, sum(count) as count from aggregation ` +
      `where day between (? - interval ${duration} day) and ? ` +
      `group by word, type order by count desc limit ${number}`,
      [date, date]
    );
  }
  fetchTrendRanking(duration, number, date) {
    return this._query(
      'select a.word as word, a.type as type, (a.count - coalesce(b.count,0)) as count ' +
      `from (select word, type, sum(count) as count from aggregation where day between (? - interval ${duration} day) and ? group by word, type) as a ` +
      `left join (select word, type, sum(count) as count from aggregation where day between (? - interval ${duration * 2} day) and (? - interval ${duration + 1} day) group by word, type) as b ` +
      'on a.word = b.word ' +
      'where (a.count - coalesce(b.count,0)) > 0 ' +
      'order by (a.count - coalesce(b.count,0)) desc ' +
      `limit ?`,
      [
        date,
        date,
        date,
        date,
        number,
      ]
    )
  }
}

module.exports = Mysql;
