import { createUserTask } from '@/routes/tasks/service/createTask';
import { insertUserTask } from '@/routes/tasks/model';
import { testConnection } from '@/database/testDB';

jest.mock('@/routes/tasks/model', () => ({
  insertUserTask: jest.fn(),
}));

jest.mock('@/utils/accessControl/strategies/validateTeamAccess', () => ({
  validateTeamAccess: jest.fn(),
}));

describe('createUserTask()', () => {
  test('유저 할 일 생성 시 정상 응답 반환', async () => {
    (insertUserTask as jest.Mock).mockResolvedValue({
      id: 1,
      contents: 'task1',
    });

    const result = await createUserTask(testConnection, {
      userId: 1,
      contents: 'task1',
      duration: 3,
    });

    expect(result.status).toBe(201);
    expect(result.data).toEqual({ id: 1, contents: 'task1' });
    expect(insertUserTask).toHaveBeenCalledWith(expect.anything(), {
      userId: 1,
      contents: 'task1',
      duration: 3,
    });
  });
});
