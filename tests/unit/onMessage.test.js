const onMessage = require('../../scripts/onMessage');

describe('onMessage', () => {
  let req, res;
  const textMsg = 'test message';
  beforeEach(() => {
    req = {
      body: {
        type: 'event_callback',
        event: {
          text: textMsg,
        },
      },
    };
    res = {
      status: jest.fn(function(){return this;}),
      json: jest.fn(),
    };
  });
  test('returns challenge Message', () => {
    onMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({message: textMsg});
  });
});
