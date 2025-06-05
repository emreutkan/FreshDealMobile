import { logRequest, logResponse, logError } from '@/src/utils/logger';

describe('logger utility', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('logRequest prints request info', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logRequest('fn', '/endpoint', {a: 1});
    expect(spy).toHaveBeenCalledWith('[REQUEST] [fn] Endpoint: /endpoint');
    expect(spy).toHaveBeenCalledWith('[REQUEST] [fn] Payload:', JSON.stringify({a:1}, null, 2));
  });

  test('logResponse prints response info', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logResponse('fn', '/endpoint', {success: true});
    expect(spy).toHaveBeenCalledWith('[RESPONSE] [fn] Endpoint: /endpoint');
    expect(spy).toHaveBeenCalledWith('[RESPONSE] [fn] Data:', JSON.stringify({success:true}, null, 2));
  });

  test('logError prints error info', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    const err = { message: 'oops' } as any;
    logError('fn', '/endpoint', err);
    expect(spy).toHaveBeenCalledWith('[ERROR] [fn] Endpoint: /endpoint');
    expect(spy).toHaveBeenCalledWith('[ERROR] [fn] Message: oops');
  });
});
