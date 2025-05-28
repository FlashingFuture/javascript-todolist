import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('GET /api/teams/members/:teamId', () => {
  const agent = request.agent(app);
  let createdTeamId: number;

  beforeEach(async () => {
    await agent.post('/api/users/register').send({
      userId: 'owner',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
    await agent.post('/api/users/login').send({
      userId: 'owner',
      password: 'pw1234',
    });

    const res = await agent.post('/api/teams').send({
      teamId: 'testTeam',
    });
    createdTeamId = res.body.data.id;

    await agent.post('/api/users/register').send({
      userId: 'member1',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    await agent.post(`/api/teams/${createdTeamId}`).send({
      newMemberId: 'member1',
    });
  });

  test('팀장이 팀원 목록 조회 성공', async () => {
    const response = await agent.get(`/api/teams/members/${createdTeamId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('조회 성공');
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('name');
  });

  test('팀원이 팀원 목록 조회 시 403 에러', async () => {
    await agent.post('/api/users/login').send({
      userId: 'member1',
      password: 'pw1234',
    });

    const response = await agent.get(`/api/teams/members/${createdTeamId}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('팀장만 팀원을 조회할 수 있습니다.');
  });
});
