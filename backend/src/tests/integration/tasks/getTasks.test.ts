import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

const agent = request.agent(app);

describe('GET /api/tasks', () => {
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

    await agent.post('/api/tasks').send({ contents: '개인 A', duration: 1 });
    await agent.post('/api/tasks').send({ contents: '개인 B', duration: 2 });

    await agent.post('/api/tasks').send({
      teamId,
      contents: '팀 A',
      duration: 1,
    });
    await agent.post('/api/tasks').send({
      teamId,
      contents: '팀 B',
      duration: 2,
    });
  });

  test('개인 할 일 조회 성공', async () => {
    const res = await agent.get('/api/tasks');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('조회 성공');
    expect(res.body.data.tasksTodo.length).toBe(2);

    const todos = res.body.data.tasksTodo;
    expect(new Date(todos[0].due_date) <= new Date(todos[1].due_date)).toBe(
      true
    );
  });

  test('팀 할 일 조회 성공', async () => {
    const res = await agent.get(`/api/tasks?teamId=${teamId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('조회 성공');
    expect(res.body.data.tasksTodo.length).toBe(2);

    const todos = res.body.data.tasksTodo;
    expect(new Date(todos[0].due_date) <= new Date(todos[1].due_date)).toBe(
      true
    );
  });
});
