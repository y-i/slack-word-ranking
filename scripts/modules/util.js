exports.formatDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return [year, month, day].join('-');
};

exports.getUserInfo = async userID => {
  return fetch(`https://slack.com/api/users.info?token=${process.env.SLACK_BOT_USER_TOKEN}&user=${userID}`)
    .then(res => res.json())
    .then(res => {
      if (!res.ok) {
        console.error(res);
        return null;
      }
      else return res.user.real_name;
    });
};
