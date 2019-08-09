exports.formatDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return [year, month, day].join('-');
};

exports.postMessage = async body => {
  return fetch(`https://slack.com/api/chat.postMessage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_BOT_USER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => res.json()).then(res => {
    if (!res.ok) {
      console.error(res);
    }
    return;
  }).catch(e => {
    console.error(e);
    throw e;
  });
};
