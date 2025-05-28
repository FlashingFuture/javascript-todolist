import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

const agent = request.agent(app);

let teamId: number;
let personalTaskId: number;
let teamTaskId: number;

describe('POST /api/tasks/:taskId', () => {
  beforeEach(async () => {
    const conn = await testConnection.getConnection();
    await conn.query('DELETE FROM team_members');
    await conn.query('DELETE FROM teams');
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM user_tasks');
    await conn.query('DELETE FROM team_tasks');
    conn.release();

    await agent.post('/api/users/register').send({
      userId: 'taskUser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    await agent.post('/api/users/login').send({
      userId: 'taskUser',
      password: 'pw1234',
    });

    const teamRes = await agent.post('/api/teams').send({ teamId: 'taskTeam' });
    teamId = teamRes.body.data.id;

    const personalTaskRes = await agent.post('/api/tasks').send({
      contents: '개인 할일 완료 대상',
      duration: 2,
    });
    personalTaskId = personalTaskRes.body.data.id;

    const teamTaskRes = await agent.post('/api/tasks').send({
      teamId,
      contents: '팀 할일 완료 대상',
      duration: 3,
    });
    teamTaskId = teamTaskRes.body.data.id;
  });

  test('개인 할 일 완료 성공', async () => {
    const res = await agent.post(`/api/tasks/${personalTaskId}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/완료 상태로 바뀌었습니다/);
  });

  test('팀 할 일 완료 성공', async () => {
    const res = await agent.post(`/api/tasks/${teamTaskId}?teamId=${teamId}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/완료 상태로 바뀌었습니다/);
  });
});
