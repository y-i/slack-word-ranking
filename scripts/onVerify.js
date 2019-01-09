const onVerify = (req, res) => {
  const payload = req.body;
  res.status(200).json({
    challenge: payload.challenge,
  });
};

module.exports = onVerify;
