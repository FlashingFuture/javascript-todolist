import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('DELETE /api/teams/:teamId', () => {
  const agent = request.agent(app);

  let createdTeamId: number;

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

    await agent.post('/api/teams').send({ teamId: 'testTeam' });

    const res = await agent.get('/api/teams');
    createdTeamId = res.body.data.find(
      (team: any) => team.name === 'testTeam'
    ).id;
  });

  test('팀장이 팀을 삭제할 수 있어야 한다', async () => {
    const response = await agent.delete(`/api/teams/${createdTeamId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('testTeam 팀이 삭제되었습니다.');
  });

  test('팀장이 아닌 사용자가 팀 삭제를 시도하면 403 에러 발생', async () => {
    await agent.post('/api/users/register').send({
      userId: 'nonOwner',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    await agent
      .post(`/api/teams/${createdTeamId}`)
      .send({ newMemberId: 'nonOwner' });

    await agent.post('/api/users/login').send({
      userId: 'nonOwner',
      password: 'pw1234',
    });

    const response = await agent.delete(`/api/teams/${createdTeamId}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('팀장만 팀을 삭제할 수 있습니다.');
  });
});
