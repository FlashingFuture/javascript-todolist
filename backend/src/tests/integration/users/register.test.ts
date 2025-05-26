import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('POST /api/users/register', () => {
  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query('DELETE FROM users');
    conn.release();
  });

  test('회원가입 성공', async () => {
    const response = await request(app).post('/api/users/register').send({
      userId: 'testuser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/성공/);
  });

  test('비밀번호 불일치 시 400 에러', async () => {
    const response = await request(app).post('/api/users/register').send({
      userId: 'testuser',
      password: 'pw1234',
      rePassword: 'wrongpw',
    });

    expect(response.status).toBe(400);
  });

  test('중복된 userId로 회원가입 시 409 에러', async () => {
    await request(app).post('/api/users/register').send({
      userId: 'testuser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    const response = await request(app).post('/api/users/register').send({
      userId: 'testuser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
    console.log(response);

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/이미 존재하는/);
  });
});
