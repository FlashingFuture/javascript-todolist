jest.mock('@/routes/teams/model', () => ({
  selectTeamById: jest.fn(),
  selectMembersByTeamId: jest.fn(),
}));

import { getTeamMembers } from '@/routes/teams/service/getTeamMembers';
import { selectTeamById, selectMembersByTeamId } from '@/routes/teams/model';
import { HTTPError } from '@/utils/httpError';

describe('getTeamMembers()', () => {
  test('존재하지 않는 팀일 경우 404 에러를 반환해야 한다', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue(undefined);

    await expect(
      getTeamMembers({ teamId: 1, requesterId: 10 })
    ).rejects.toThrow(new HTTPError(404, '팀을 찾을 수 없습니다.'));
  });

  test('요청자가 팀장이 아닌 경우 403 에러를 반환해야 한다', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'ProjectX',
      owner_id: 42,
    });

    await expect(
      getTeamMembers({ teamId: 1, requesterId: 99 })
    ).rejects.toThrow(new HTTPError(403, '팀장만 팀원을 조회할 수 있습니다.'));
  });

  test('정상적으로 팀 멤버 목록을 반환해야 한다', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'ProjectX',
      owner_id: 10,
    });

    const fakeMembers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    (selectMembersByTeamId as jest.Mock).mockResolvedValue(fakeMembers);

    const result = await getTeamMembers({ teamId: 1, requesterId: 10 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('조회 성공');
    expect(result.data).toEqual(fakeMembers);
    expect(selectMembersByTeamId).toHaveBeenCalledWith(expect.anything(), 1);
  });
});
