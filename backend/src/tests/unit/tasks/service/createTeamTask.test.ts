import { createTeamTask } from '@/routes/tasks/service/createTask';
import { insertTeamTask } from '@/routes/tasks/model';
import { validateTeamAccess } from '@/utils/accessControl/strategies/validateTeamAccess';
import { HTTPError } from '@/utils/httpError';
import { testConnection } from '@/database/testDB';

jest.mock('@/routes/tasks/model', () => ({
  insertTeamTask: jest.fn(),
}));

jest.mock('@/utils/accessControl/strategies/validateTeamAccess', () => ({
  validateTeamAccess: jest.fn(),
}));

describe('createTeamTask()', () => {
  test('팀 접근 권한이 없으면 403 에러 발생', async () => {
    (validateTeamAccess as jest.Mock).mockResolvedValue(false);

    await expect(
      createTeamTask(testConnection, {
        teamId: 1,
        userId: 2,
        contents: 'task',
        duration: 5,
      })
    ).rejects.toThrow(
      new HTTPError(403, '해당 팀에 할 일을 추가할 권한이 없습니다.')
    );
  });

  test('정상적인 팀 할 일 생성 시 응답 반환', async () => {
    (validateTeamAccess as jest.Mock).mockResolvedValue(true);
    (insertTeamTask as jest.Mock).mockResolvedValue({
      teamId: 1,
      id: 10,
      contents: 'task',
    });

    const result = await createTeamTask(testConnection, {
      teamId: 1,
      userId: 2,
      contents: 'task',
      duration: 5,
    });

    expect(result.status).toBe(201);
    expect(result.data).toEqual({ teamId: 1, id: 10, contents: 'task' });
    expect(validateTeamAccess).toHaveBeenCalledWith(expect.anything(), 1, 2);
    expect(insertTeamTask).toHaveBeenCalledWith(expect.anything(), {
      teamId: 1,
      contents: 'task',
      duration: 5,
    });
  });
});
