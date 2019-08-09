const Mysql = require('./modules/mysql');
const util = require('./modules/util');
const fetch = require('node-fetch');

const onSlashCommand = async (req, res) => {
  const {
    command,
    response_url,
    text, // args
    trigger_id,
    user_id,
    user_name
  } = req.body;
  // とりあえずOKだけ返して後で中身を送る(3000msまでの為)
  res.status(200).send();

  try {
    const mysql = new Mysql();
    mysql.connect();

    // DBから取る
    const createRankingRow = (row, index) => {
      return `${index + 1}: ${row.word} (${row.type}) (${row.count}pt.)`;
    };
    const today = util.formatDate();
    const ranking1day = await mysql.fetchRanking(1, 10, today);
    const ranking7days = await mysql.fetchRanking(7, 10, today);
    const Trend1day = await mysql.fetchTrendRanking(1, 10, today);
    const Trend7days = await mysql.fetchTrendRanking(7, 10, today);

    fetch(response_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response_type: 'in_channel',
        text: `${today}のランキングは以下のとおりです`,
        attachments: [{
          color: 'good',
          text: '',
          fields: [
            {
              title: '昨日からのランキング',
              value: ranking1day.map(createRankingRow).join('\n'),
              short: 'true',
            },
            {
              title: '一週間分のランキング',
              value: ranking7days.map(createRankingRow).join('\n'),
              short: 'true',
            },
            {
              title: '昨日のトレンド',
              value: Trend1day.map(createRankingRow).join('\n'),
              short: 'true',
            },
            {
              title: '一週間分のトレンド',
              value: Trend7days.map(createRankingRow).join('\n'),
              short: 'true',
            },
          ],
          footer: 'Send from cloud functions',
        }],
      }),
    }).then(res => {
      if (res.status !== 200) throw `${res.status}: ${res.statusText}`;
    }).catch(err => {
      console.error(err);
    });
  } catch (e) {
    console.error(`Error: ${e}`);
  }
  res.end();
};

module.exports = onSlashCommand;
