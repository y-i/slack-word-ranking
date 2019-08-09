const onVerify = require('../../scripts/onVerify');

describe('onVerify', () => {
  let req, res;
  const challengeMsg = 'Challenge Message';
  beforeEach(() => {
    req = {
      body: {
        type: 'url_verification',
        challenge: challengeMsg,
      },
    };
    res = {
      status: jest.fn(function(){return this;}),
      json: jest.fn(),
    };
  });
  test('returns challenge Message', () => {
    onVerify(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({challenge: challengeMsg});
  });
});
