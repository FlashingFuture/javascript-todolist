jest.mock('@/routes/teams/model', () => ({
  selectTeamsByUserId: jest.fn(),
}));

import { getTeams } from '@/routes/teams/service/getTeams';
import { selectTeamsByUserId } from '@/routes/teams/model';
import { testConnection } from '@/database/testDB';

describe('getTeams()', () => {
  test('사용자가 속한 팀이 없는 경우 빈 배열 반환', async () => {
    (selectTeamsByUserId as jest.Mock).mockResolvedValue([]);

    const result = await getTeams(testConnection, { userId: 1 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('조회 성공');
    expect(result.data).toEqual([]);
  });

  test('사용자가 속한 팀 목록을 반환해야 한다', async () => {
    const fakeTeams = [
      { id: 1, name: 'TeamA' },
      { id: 2, name: 'TeamB' },
    ];
    (selectTeamsByUserId as jest.Mock).mockResolvedValue(fakeTeams);

    const result = await getTeams(testConnection, { userId: 1 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('조회 성공');
    expect(result.data).toEqual(fakeTeams);
    expect(selectTeamsByUserId).toHaveBeenCalledWith(expect.anything(), 1);
  });
});
