import request from 'supertest';
import app from '../testApp';
import { testConnection } from '@/database/testDB';

const agent = request.agent(app);

describe('DELETE /api/tasks/:taskId', () => {
  let teamId: number;
  let personalTaskId: number;
  let teamTaskId: number;

  beforeEach(async () => {
    await agent.post('/api/users/register').send({
      userId: 'deleteUser',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
    await agent.post('/api/users/login').send({
      userId: 'deleteUser',
      password: 'pw1234',
    });

    const teamRes = await agent.post('/api/teams').send({
      teamId: 'deleteTeam',
    });
    teamId = teamRes.body.data.id;

    const personalTaskRes = await agent.post('/api/tasks').send({
      contents: 'Delete Personal Task',
      duration: 2,
    });
    personalTaskId = personalTaskRes.body.data.id;

    const teamTaskRes = await agent.post('/api/tasks').send({
      teamId,
      contents: 'Delete Team Task',
      duration: 2,
    });
    teamTaskId = teamTaskRes.body.data.id;
  });

  test('개인 할 일 삭제 성공', async () => {
    const res = await agent.delete(`/api/tasks/${personalTaskId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('할 일이 삭제되었습니다.');
  });

  test('팀 할 일 삭제 성공', async () => {
    const res = await agent.delete(`/api/tasks/${teamTaskId}?teamId=${teamId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('할 일이 삭제되었습니다.');
  });

  test('권한 없는 사용자 삭제 시 403 에러', async () => {
    await agent.post('/api/users/register').send({
      userId: 'outsiderDel',
      password: 'pw1234',
      rePassword: 'pw1234',
    });
    await agent.post('/api/users/login').send({
      userId: 'outsiderDel',
      password: 'pw1234',
    });

    const res = await agent.delete(`/api/tasks/${teamTaskId}?teamId=${teamId}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/권한이 없습니다/);
  });
});
