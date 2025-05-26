import { completeTeamTask } from '@/routes/tasks/service/completeTask';
import { finishTeamTask } from '@/routes/tasks/model';
import { validateTaskAccess } from '@/utils/accessControl/validateTaskAccess';
import { HTTPError } from '@/utils/httpError';

jest.mock('@/routes/tasks/model', () => ({
  finishTeamTask: jest.fn(),
}));

jest.mock('@/utils/accessControl/validateTaskAccess', () => ({
  validateTaskAccess: jest.fn(),
}));

describe('completeTeamTask()', () => {
  test('권한이 없는 경우 403 에러', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(false);

    await expect(
      completeTeamTask({ taskId: 1, teamId: 100, userId: 2 })
    ).rejects.toThrow(new HTTPError(403, '해당 작업에 대한 권한이 없습니다.'));
  });

  test('작업을 찾지 못한 경우 404 에러', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(true);
    (finishTeamTask as jest.Mock).mockResolvedValue(null);

    await expect(
      completeTeamTask({ taskId: 1, teamId: 100, userId: 2 })
    ).rejects.toThrow(new HTTPError(404, '해당 할 일을 찾을 수 없습니다.'));
  });

  test('정상적으로 완료 처리된 경우 응답 반환', async () => {
    (validateTaskAccess as jest.Mock).mockResolvedValue(true);
    (finishTeamTask as jest.Mock).mockResolvedValue({
      taskId: 1,
      teamId: 100,
      isDone: true,
    });

    const result = await completeTeamTask({
      taskId: 1,
      teamId: 100,
      userId: 2,
    });

    expect(result.status).toBe(201);
    expect(result.data).toEqual({ taskId: 1, teamId: 100, isDone: true });
    expect(validateTaskAccess).toHaveBeenCalledWith(
      expect.anything(),
      1,
      2,
      100
    );
    expect(finishTeamTask).toHaveBeenCalledWith(expect.anything(), 1, 100);
  });
});
