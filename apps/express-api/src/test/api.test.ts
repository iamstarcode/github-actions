import request from 'supertest';
import { app } from '../app';
import { describe, expect, test } from '@jest/globals';

describe('Express server tests', () => {
  test('GET / returns greeting', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello from Express + TypeScript!');
  });

  test('GET /api/hello returns JSON', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Hello from backend!' });
  });
});
