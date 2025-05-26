import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('DELETE /api/teams/members/:teamId', () => {
  const agent = request.agent(app);
  let createdTeamId: number;
  let memberId: number;

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

    await agent
      .post(`/api/teams/members/${createdTeamId}`)
      .send({ newMemberId: 'test1' });

    const memberRes = await agent.get(`/api/teams/members/${createdTeamId}`);
    const test1 = memberRes.body.data.find((m: any) => m.name === 'test1');
    memberId = test1.id;
  });

  test('팀장이 팀원을 삭제할 수 있어야 한다', async () => {
    const res = await agent
      .delete(`/api/teams/members/${createdTeamId}`)
      .send({ memberId });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/test1.*삭제/);
  });

  test('팀장이 아닌 사용자가 팀원을 삭제하려 하면 403 에러 발생', async () => {
    await agent.post('/api/users/login').send({
      userId: 'test1',
      password: 'pw1234',
    });

    const res = await agent
      .delete(`/api/teams/members/${createdTeamId}`)
      .send({ memberId });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('팀장만 팀원을 삭제할 수 있습니다.');
  });

  test('없는 팀원을 삭제하려고 하면 404 에러 발생', async () => {
    await agent.post('/api/users/login').send({
      userId: 'owner',
      password: 'pw1234',
    });

    const res = await agent
      .delete(`/api/teams/members/${createdTeamId}`)
      .send({ memberId: 99999 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('삭제할 사용자를 찾을 수 없습니다.');
  });
});
