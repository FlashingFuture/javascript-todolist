import { deleteTeamTaskService } from '@/routes/tasks/service/deleteTask';
import { deleteTeamTask } from '@/routes/tasks/model';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { HTTPError } from '@/utils/httpError';

jest.mock('@/routes/tasks/model', () => ({
  deleteTeamTask: jest.fn(),
}));

jest.mock('@/utils/accessControl/validateTaskAccess', () => ({
  validateTaskAccess: jest.fn(),
}));

describe('deleteTeamTaskService()', () => {
  test('권한 없을 경우 403 에러 발생', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(false);

    await expect(
      deleteTeamTaskService({ taskId: 1, teamId: 10, userId: 2 })
    ).rejects.toThrow(new HTTPError(403, '해당 작업에 대한 권한이 없습니다.'));
  });

  test('삭제 실패 시 404 에러 발생', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(true);
    (deleteTeamTask as jest.Mock).mockResolvedValue(false);

    await expect(
      deleteTeamTaskService({ taskId: 1, teamId: 10, userId: 2 })
    ).rejects.toThrow(new HTTPError(404, '해당 할 일을 찾을 수 없습니다.'));
  });

  test('정상적으로 삭제되면 응답 반환', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(true);
    (deleteTeamTask as jest.Mock).mockResolvedValue(true);

    const result = await deleteTeamTaskService({
      taskId: 1,
      teamId: 10,
      userId: 2,
    });

    expect(result.status).toBe(200);
    expect(result.message).toBe('할 일이 삭제되었습니다.');
    expect(deleteTeamTask).toHaveBeenCalledWith(expect.anything(), 1, 10);
  });
});
