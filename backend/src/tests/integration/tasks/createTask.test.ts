import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

const agent = request.agent(app);

describe('POST /api/tasks', () => {
  let teamId: number;

  beforeEach(async () => {
    await agent.post('/api/users/register').send({
      userId: 'taskUser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    await agent.post('/api/users/login').send({
      userId: 'taskUser',
      password: 'pw1234',
    });

    const res = await agent.post('/api/teams').send({ teamId: 'taskTeam' });
    teamId = res.body.data.id;
  });

  test('개인 할 일 생성 성공', async () => {
    const response = await agent.post('/api/tasks').send({
      contents: 'my personal todo',
      duration: 3,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/등록 성공/);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.contents).toBe('my personal todo');
  });

  test('팀 할 일 생성 성공', async () => {
    const response = await agent.post('/api/tasks').send({
      teamId,
      contents: 'team todo task',
      duration: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/등록 성공/);
    expect(response.body.data).toMatchObject({
      teamId,
      contents: 'team todo task',
    });
  });

  test('팀원이 아닌 경우 팀 할 일 생성 시 403 에러', async () => {
    const conn = await testConnection.getConnection();
    await conn.query('DELETE FROM team_members');
    conn.release();

    const response = await agent.post('/api/tasks').send({
      teamId,
      contents: 'unauthorized task',
      duration: 2,
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/권한이 없습니다/);
  });
});
