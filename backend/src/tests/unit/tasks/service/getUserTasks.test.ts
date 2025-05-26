import { getUserTasks } from '@/routes/tasks/service/getTasks';
import { selectUserTasks } from '@/routes/tasks/model';

jest.mock('@/routes/tasks/model', () => ({
  selectUserTasks: jest.fn(),
}));

describe('getUserTasks()', () => {
  test('사용자의 할 일이 완료/미완료로 분리되어 반환되어야 한다', async () => {
    (selectUserTasks as jest.Mock).mockResolvedValue([
      { taskId: 1, contents: 'a', isDone: false },
      { taskId: 2, contents: 'b', isDone: true },
    ]);

    const result = await getUserTasks({ userId: 1 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('조회 성공');
    expect(result.data.tasksTodo).toEqual([
      { taskId: 1, contents: 'a', isDone: false },
    ]);
    expect(result.data.tasksDone).toEqual([
      { taskId: 2, contents: 'b', isDone: true },
    ]);
    expect(selectUserTasks).toHaveBeenCalledWith(expect.anything(), 1);
  });
});
