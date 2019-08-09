const Mysql = require('./modules/mysql');
const util = require('./modules/util');

const onDaily = async (req, res) => {
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

    await util.postMessage({
      channel: '#bot',
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
    });
  } catch (e) {
    console.error(`Error: ${e}`);
  } finally {
    res.status(200).end();
  }
};

module.exports = onDaily;
