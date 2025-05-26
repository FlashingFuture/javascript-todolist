import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

describe('GET /api/teams', () => {
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

    await agent.post('/api/teams').send({ teamId: 'testTeam' });
    await agent.post('/api/teams').send({ teamId: 'testTeam2' });
  });

  test('자신이 속한 팀 목록을 조회할 수 있어야 한다', async () => {
    const response = await agent.get('/api/teams');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('조회 성공');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);

    const teamNames = response.body.data.map((team: any) => team.name);
    expect(teamNames).toContain('testTeam');
    expect(teamNames).toContain('testTeam2');
  });
});
