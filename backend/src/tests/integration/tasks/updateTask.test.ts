import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

const agent = request.agent(app);

describe('PUT /api/tasks/:taskId', () => {
  let teamId: number;
  let userTaskId: number;
  let teamTaskId: number;

  beforeEach(async () => {
    await agent.post('/api/users/register').send({
      userId: 'updateUser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });

    await agent.post('/api/users/login').send({
      userId: 'updateUser',
      password: 'pw1234',
    });

    const teamRes = await agent
      .post('/api/teams')
      .send({ teamId: 'updateTeam' });
    teamId = teamRes.body.data.id;

    const userTaskRes = await agent.post('/api/tasks').send({
      contents: 'user task',
      duration: 1,
    });
    userTaskId = userTaskRes.body.data.id;

    const teamTaskRes = await agent.post('/api/tasks').send({
      teamId,
      contents: 'team task',
      duration: 1,
    });
    teamTaskId = teamTaskRes.body.data.id;
  });

  test('개인 할 일 수정 성공', async () => {
    const res = await agent.put(`/api/tasks/${userTaskId}`).send({
      contents: 'updated personal task',
      duration: 5,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('수정 완료');
    expect(res.body.data.contents).toBe('updated personal task');
    expect(res.body.data.taskId).toBe(userTaskId);
  });

  test('팀 할 일 수정 성공', async () => {
    const res = await agent.put(`/api/tasks/${teamTaskId}`).send({
      contents: 'updated team task',
      duration: 3,
      teamId,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('수정 완료');
    expect(res.body.data.contents).toBe('updated team task');
    expect(res.body.data.taskId).toBe(teamTaskId);
  });

  test('권한 없는 사용자의 수정 시도 시 403 에러', async () => {
    await agent.post('/api/users/register').send({
      userId: 'outsider2',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
    await agent.post('/api/users/login').send({
      userId: 'outsider2',
      password: 'pw1234',
    });

    const res = await agent.put(`/api/tasks/${teamTaskId}`).send({
      contents: 'unauthorized update',
      duration: 3,
      teamId,
    });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('해당 작업에 대한 권한이 없습니다.');
  });
});
