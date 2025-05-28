jest.mock('@/routes/teams/model', () => ({
  insertTeam: jest.fn(),
}));

import { createTeam } from '@/routes/teams/service/createTeam';
import { insertTeam } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';

describe('createTeam()', () => {
  test('정상적으로 팀이 생성되면 응답에 팀 정보와 메시지가 포함되어야 한다', async () => {
    (insertTeam as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'myteam',
    });

    const result = await createTeam(testConnection, {
      teamId: 'myteam',
      ownerId: 42,
    });

    expect(result.status).toBe(201);
    expect(result.message).toBe('myteam 팀이 만들어졌습니다.');
    expect(result.data).toEqual({ id: 1, name: 'myteam' });
    expect(insertTeam).toHaveBeenCalledWith(expect.anything(), 'myteam', 42);
  });
});
