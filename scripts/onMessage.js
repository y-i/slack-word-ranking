const CotohaParser = require('./modules/cotoha');
const Mysql = require('./modules/mysql');
const util = require('./modules/util');

const onMessage = async (req, res) => {
  try {
    const mysql = new Mysql();
    const parser = new CotohaParser();
    mysql.connect();

    const event = req.body.event;
    const {text, user, subtype, bot_id} = event;

    // リプライと絵文字を削除
    const formatedText = text.replace(/@[^\s]+/g, '').replace(/:[a-zA-Z0-9-]+:/g, '');

    // 5文字以下の場合は記録しない
    if (formatedText.length <= 5) return res.status(200).end();

    // botの発言の場合記録しない
    if (subtype === 'bot_message') return res.status(200).end();

    // Add to DB.
    const today = util.formatDate();
    const results = await parser.parse(formatedText);

    console.log(results);

    for (let result of results) {
      await mysql.add(result.word, result.type, today);
    }
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(200).send(`Error: ${e}`);
    return;
  }
  res.status(200).end();
};

module.exports = onMessage;
