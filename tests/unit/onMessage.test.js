const onMessage = require('../../scripts/onMessage');
const CotohaParser = require('../../scripts/modules/cotoha');
const Mysql = require('../../scripts/modules/mysql');
const util = require('../../scripts/modules/util');

const mockMysqlAdd = jest.fn();
jest.mock('../../scripts/modules/cotoha', () => {
  return jest.fn().mockImplementation(() => {
    return {
      parse: jest.fn().mockImplementation(() => {
        return [
          {word: 'test', type: '名詞',},
          {word: 'message', type: '名詞',},
        ];
      }),
    };
  });
});
jest.mock('../../scripts/modules/mysql', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn(),
      add: mockMysqlAdd,
      fetchRanking: jest.fn(),
    }
  });
});

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
      end: jest.fn(),
      json: jest.fn(),
      status: jest.fn(function(){return this;}),
    };
  });
  test('returns 200', async () => {
    await onMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });
  test('adds words to mysql', async () => {
    await onMessage(req, res);

    expect(mockMysqlAdd).toHaveBeenCalledWith('test', '名詞', util.formatDate());
    expect(mockMysqlAdd).toHaveBeenCalledWith('message', '名詞', util.formatDate());
  });
});
