import { updateTeamTaskService } from '@/routes/tasks/service/updateTask';
import { updateTeamTask } from '@/routes/tasks/model';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { HTTPError } from '@/utils/httpError';
import { testConnection } from '@/database/testDB';

jest.mock('@/routes/tasks/model', () => ({
  updateTeamTask: jest.fn(),
}));
jest.mock('@/utils/accessControl/validateTaskAccess', () => ({
  validateTaskAccess: jest.fn(),
}));

describe('updateTeamTaskService', () => {
  test('권한이 없으면 403 에러', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(false);

    await expect(
      updateTeamTaskService(testConnection, {
        taskId: 1,
        contents: 'updated',
        duration: 3,
        teamId: 2,
        userId: 10,
      })
    ).rejects.toThrow(new HTTPError(403, '해당 작업에 대한 권한이 없습니다.'));
  });

  test('업데이트된 작업이 없으면 404 에러', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(true);
    (updateTeamTask as jest.Mock).mockResolvedValue(null);

    await expect(
      updateTeamTaskService(testConnection, {
        taskId: 1,
        contents: 'updated',
        duration: 3,
        teamId: 2,
        userId: 10,
      })
    ).rejects.toThrow(new HTTPError(404, '해당 할 일을 찾을 수 없습니다.'));
  });

  test('정상적으로 수정되면 결과 반환', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(true);
    (updateTeamTask as jest.Mock).mockResolvedValue({
      taskId: 1,
      contents: 'updated',
      dueDate: '2025-06-01',
      isDone: false,
    });

    const result = await updateTeamTaskService(testConnection, {
      taskId: 1,
      contents: 'updated',
      duration: 3,
      teamId: 2,
      userId: 10,
    });

    expect(result.status).toBe(200);
    expect(result.message).toBe('수정 완료');
    expect(result.data.contents).toBe('updated');
  });
});
