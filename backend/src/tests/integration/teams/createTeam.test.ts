import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('POST /api/teams', () => {
  const agent = request.agent(app);

  beforeEach(async () => {
    await agent.post('/api/users/register').send({
      userId: 'teamUser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
    await agent.post('/api/users/login').send({
      userId: 'teamUser',
      password: 'pw1234',
    });
  });

  test('팀 생성 성공', async () => {
    const response = await agent.post('/api/teams').send({
      teamId: 'testTeam',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/testTeam.*만들어졌습니다/);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe('testTeam');
  });

  test('유효하지 않은 토큰으로 요청 시 401 응답', async () => {
    const invalidCookie =
      'todolist_token=eyJhbGciOiJIUzI1NiIsInR...FAKE...TOKEN';

    const response = await request(app)
      .post('/api/teams')
      .set('Cookie', invalidCookie)
      .send({ teamId: 'invalidTeam' });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/토큰/);
  });

  test('로그인 없이 팀 생성 요청 시 401', async () => {
    const response = await request(app)
      .post('/api/teams')
      .send({ teamId: 'noLoginTeam' });
    expect(response.status).toBe(401);
  });
});
