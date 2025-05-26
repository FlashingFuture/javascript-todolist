import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('POST /api/teams/members/:teamId', () => {
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

    const res = await agent.post('/api/teams').send({ teamId: 'testTeam' });
    createdTeamId = res.body.data.id;

    await agent.post('/api/users/register').send({
      userId: 'test1',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
  });

  test('팀장이 팀원을 추가할 수 있어야 한다', async () => {
    const res = await agent
      .post(`/api/teams/members/${createdTeamId}`)
      .send({ newMemberId: 'test1' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/test1.*추가/);
    expect(res.body.data).toEqual({
      userId: 'test1',
      teamId: 'testTeam',
    });
  });

  test('팀장이 아닌 유저가 팀원 추가 시도 시 403 에러', async () => {
    await agent.post('/api/users/login').send({
      userId: 'test1',
      password: 'pw1234',
    });

    const res = await agent
      .post(`/api/teams/members/${createdTeamId}`)
      .send({ newMemberId: 'owner' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('팀장만 팀원을 추가할 수 있습니다.');
  });
});
