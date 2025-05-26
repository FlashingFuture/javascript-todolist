import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query('DELETE FROM users');
    conn.release();

    await request(app).post('/api/users/register').send({
      userId: 'testuser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
  });

  test('존재하지 않는 유저일 경우 401 에러', async () => {
    const response = await request(app).post('/api/users/login').send({
      userId: 'nouser',
      password: 'pw1234',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/아이디/);
  });

  test('비밀번호가 틀린 경우 401 에러', async () => {
    const response = await request(app).post('/api/users/login').send({
      userId: 'testuser',
      password: 'wrongpw',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/비밀번호/);
  });

  test('로그인 성공 시 200 상태코드와 쿠키 포함', async () => {
    const response = await request(app).post('/api/users/login').send({
      userId: 'testuser',
      password: 'pw1234',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/성공/);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toMatch(/todolist_token/);
  });
});
