import request from 'supertest';
import app from '@/app';
import { testConnection } from '@/database/testDB';

describe('Users API', () => {
  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query('DELETE FROM users');
    conn.release();
  });

  test('회원가입 성공', async () => {
    const response = await request(app).post('/users/register').send({
      userId: 'testuser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/성공/);
  });

  test('비밀번호 불일치 시 400 에러', async () => {
    const response = await request(app).post('/users/register').send({
      userId: 'testuser',
      password: 'pw1234',
      rePassword: 'wrongpw',
    });

    expect(response.status).toBe(400);
  });
});
