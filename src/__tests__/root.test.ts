/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import app from '../app';

describe('Test api root path', () => {
  test('Exists', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
  });

  test('Return arbritrary string indicating is root of API', async () => {
    const res = await request(app).get('/');
    expect(res.text).toEqual('Root of API');
  });
});
