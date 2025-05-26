import { getTeamTasks } from '@/routes/tasks/service/getTasks';
import { selectTeamTasks } from '@/routes/tasks/model';

jest.mock('@/routes/tasks/model', () => ({
  selectTeamTasks: jest.fn(),
}));

describe('getTeamTasks()', () => {
  test('팀의 할 일이 완료/미완료로 분리되어 반환되어야 한다', async () => {
    (selectTeamTasks as jest.Mock).mockResolvedValue([
      { taskId: 3, contents: 'x', isDone: false },
      { taskId: 4, contents: 'y', isDone: true },
    ]);

    const result = await getTeamTasks({ teamId: 10 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('조회 성공');
    expect(result.data.tasksTodo).toEqual([
      { taskId: 3, contents: 'x', isDone: false },
    ]);
    expect(result.data.tasksDone).toEqual([
      { taskId: 4, contents: 'y', isDone: true },
    ]);
    expect(selectTeamTasks).toHaveBeenCalledWith(expect.anything(), 10);
  });
});
