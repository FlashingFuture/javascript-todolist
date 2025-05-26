jest.mock('@/routes/teams/model', () => ({
  selectTeamById: jest.fn(),
  selectTeamMemberById: jest.fn(),
  deleteTeamMemberByUserId: jest.fn(),
}));

import { deleteTeamMember } from '@/routes/teams/service/deleteTeamMember';
import {
  selectTeamById,
  selectTeamMemberById,
  deleteTeamMemberByUserId,
} from '@/routes/teams/model';
import { HTTPError } from '@/utils/httpError';
import { testConnection } from '@/database/testDB';

describe('deleteTeamMember()', () => {
  test('존재하지 않는 팀일 경우 404 에러 반환', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue(undefined);

    await expect(
      deleteTeamMember(testConnection, { teamId: 1, ownerId: 10, memberId: 2 })
    ).rejects.toThrow(new HTTPError(404, '팀을 찾을 수 없습니다.'));
  });

  test('요청자가 팀장이 아닌 경우 403 에러 반환', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'DevTeam',
      owner_id: 99,
    });

    await expect(
      deleteTeamMember(testConnection, { teamId: 1, ownerId: 10, memberId: 2 })
    ).rejects.toThrow(new HTTPError(403, '팀장만 팀원을 삭제할 수 있습니다.'));
  });

  test('삭제할 사용자가 존재하지 않는 경우 404 에러 반환', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'DevTeam',
      owner_id: 10,
    });
    (selectTeamMemberById as jest.Mock).mockResolvedValue(undefined);

    await expect(
      deleteTeamMember(testConnection, { teamId: 1, ownerId: 10, memberId: 2 })
    ).rejects.toThrow(new HTTPError(404, '삭제할 사용자를 찾을 수 없습니다.'));
  });

  test('정상적으로 팀원이 삭제되면 이름 정보 반환', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'DevTeam',
      owner_id: 10,
    });
    (selectTeamMemberById as jest.Mock).mockResolvedValue({
      id: 2,
      name: 'Alice',
    });

    (deleteTeamMemberByUserId as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteTeamMember(testConnection, {
      teamId: 1,
      ownerId: 10,
      memberId: 2,
    });

    expect(result).toEqual({
      userName: 'Alice',
      teamName: 'DevTeam',
    });
    expect(deleteTeamMemberByUserId).toHaveBeenCalledWith(
      expect.anything(),
      1,
      2
    );
  });
});
