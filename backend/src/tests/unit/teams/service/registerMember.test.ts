jest.mock('@/routes/teams/model', () => ({
  selectTeamById: jest.fn(),
  selectUserByName: jest.fn(),
  selectTeamMemberById: jest.fn(),
  insertTeamMember: jest.fn(),
}));

import { registerMember } from '@/routes/teams/service/registerMember';
import {
  selectTeamById,
  selectUserByName,
  selectTeamMemberById,
  insertTeamMember,
} from '@/routes/teams/model';
import { HTTPError } from '@/utils/httpError';

describe('registerMember()', () => {
  test('존재하지 않는 팀일 경우 404 에러', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue(undefined);

    await expect(
      registerMember({ teamId: 1, ownerId: 10, newMemberId: 'alice' })
    ).rejects.toThrow(new HTTPError(404, '팀을 찾을 수 없습니다.'));
  });

  test('요청자가 팀장이 아닌 경우 403 에러', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'DevTeam',
      owner_id: 99,
    });

    await expect(
      registerMember({ teamId: 1, ownerId: 10, newMemberId: 'alice' })
    ).rejects.toThrow(new HTTPError(403, '팀장만 팀원을 추가할 수 있습니다.'));
  });

  test('추가할 사용자가 존재하지 않을 경우 404 에러', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'DevTeam',
      owner_id: 10,
    });
    (selectUserByName as jest.Mock).mockResolvedValue(undefined);

    await expect(
      registerMember({ teamId: 1, ownerId: 10, newMemberId: 'alice' })
    ).rejects.toThrow(new HTTPError(404, '추가할 사용자를 찾을 수 없습니다.'));
  });

  test('이미 팀에 속한 사용자일 경우 409 에러', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'DevTeam',
      owner_id: 10,
    });
    (selectUserByName as jest.Mock).mockResolvedValue({
      id: 2,
      name: 'alice',
    });
    (selectTeamMemberById as jest.Mock).mockResolvedValue({
      id: 2,
      name: 'alice',
    });

    await expect(
      registerMember({ teamId: 1, ownerId: 10, newMemberId: 'alice' })
    ).rejects.toThrow(new HTTPError(409, '이미 팀에 속한 사용자입니다.'));
  });

  test('정상적으로 팀원이 추가되면 메시지와 데이터가 반환된다', async () => {
    (selectTeamById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'DevTeam',
      owner_id: 10,
    });
    (selectUserByName as jest.Mock).mockResolvedValue({
      id: 2,
      name: 'alice',
    });
    (selectTeamMemberById as jest.Mock).mockResolvedValue(undefined);
    (insertTeamMember as jest.Mock).mockResolvedValue(undefined);

    const result = await registerMember({
      teamId: 1,
      ownerId: 10,
      newMemberId: 'alice',
    });

    expect(result.status).toBe(200);
    expect(result.message).toBe('alice이 DevTeam에 팀원으로 추가되었습니다.');
    expect(result.data).toEqual({ userId: 'alice', teamId: 'DevTeam' });
    expect(insertTeamMember).toHaveBeenCalledWith(expect.anything(), 1, 2);
  });
});
