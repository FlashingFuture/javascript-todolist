jest.mock('@/routes/teams/model', () => ({
  selectTeamById: jest.fn(),
  deleteTeamById: jest.fn(),
}));

import { deleteTeam } from '@/routes/teams/service/deleteTeam';
import { selectTeamById, deleteTeamById } from '@/routes/teams/model';
import { HTTPError } from '@/utils/httpError';

describe('deleteTeam()', () => {
  test('존재하지 않는 팀 ID일 경우 404 에러를 반환해야 한다', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue(undefined);

    await expect(deleteTeam({ teamId: 9999, ownerId: 1 })).rejects.toThrowError(
      new HTTPError(404, '팀을 찾을 수 없습니다.')
    );
  });

  test('팀장이 아닌 사용자가 삭제를 시도할 경우 403 에러를 반환해야 한다', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'MockTeam',
      owner_id: 42, // 실제 팀장
    });

    await expect(
      deleteTeam({ teamId: 1, ownerId: 99 }) // 요청자는 팀장이 아님
    ).rejects.toThrow(new HTTPError(403, '팀장만 팀을 삭제할 수 있습니다.'));
  });

  test('정상적으로 팀을 삭제하면 팀 이름을 반환해야 한다', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'MyTeam',
      owner_id: 10,
    });

    (deleteTeamById as jest.Mock).mockResolvedValue(undefined); // 실제 삭제는 확인할 수 없음

    const result = await deleteTeam({ teamId: 1, ownerId: 10 });

    expect(result).toEqual({ teamName: 'MyTeam' });
    expect(deleteTeamById).toHaveBeenCalledWith(expect.anything(), 1);
  });
});
