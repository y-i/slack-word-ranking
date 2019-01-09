require('dotenv').config();
const Supertest = require('supertest');
const request = Supertest(process.env.BASE_URL);

describe('onVerify', () => {
  test('should return challenge value if type is url_verification', () => {
    const challengeMsg = "Challenge Message";
    return request
      .get(`/slackWordRankingBot`)
      .send({
        type: 'url_verification',
        challenge: challengeMsg,
        token: process.env.SLACK_APP_VERIFICATION_TOKEN,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.challenge).toBe(challengeMsg);
      });
  });
});
