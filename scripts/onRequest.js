if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const onMessage = require('./onMessage');
const onVerify = require('./onVerify');

const onSlashCommand = require('./onSlashCommand');

const onRequest = async (req, res) => {
  if (req.method !== 'POST') return res.status(403).end();

  const payload = req.body;
  if (payload.type === 'url_verification') {
    await onVerify(req, res);
    return;
  }
  if (payload.type === 'event_callback') {
    await onMessage(req, res);
    return;
  }
  res.status(403).end();
};

exports.slackWordRankingBot = onRequest;
exports.getWordRanking = onSlashCommand;
