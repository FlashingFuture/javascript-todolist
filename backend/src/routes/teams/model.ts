import { connection } from '@/database/mariadb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const createTeam = async (
  teamName: string,
  ownerId: number
): Promise<{ id: number; name: string }> => {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    const insertTeamSql = 'INSERT INTO teams (name, owner_id) VALUES (?, ?)';
    const [teamResult] = await conn.query<ResultSetHeader>(insertTeamSql, [
      teamName,
      ownerId,
    ]);

    const teamId = teamResult.insertId;

    const insertMemberSql =
      'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)';
    await conn.query(insertMemberSql, [teamId, ownerId]);
    await conn.commit();

    return {
      id: teamId,
      name: teamName,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const selectTeamsByUserId = async (
  userId: number
): Promise<{ id: number; name: string }[]> => {
  const sql = `
    SELECT t.name, t.id
    FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = ?
  `;

  const conn = await connection.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(sql, [userId]);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  } finally {
    conn.release();
  }
};

export const selectTeamById = async (teamId: number) => {
  const conn = await connection.getConnection();

  try {
    const sql = 'SELECT id, name, owner_id FROM teams WHERE id = ?';
    const [rows] = await conn.query<RowDataPacket[]>(sql, [teamId]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const deleteTeamByTeamId = async (teamId: number) => {
  const conn = await connection.getConnection();

  try {
    const sql = 'DELETE FROM teams WHERE id = ?';
    await conn.query(sql, [teamId]);
  } finally {
    conn.release();
  }
};

export const selectMembersByTeamId = async (
  teamId: number
): Promise<{ id: number; name: string }[]> => {
  const conn = await connection.getConnection();
  try {
    const sql = `
      SELECT u.id, u.name
      FROM users u
      JOIN team_members tm ON u.id = tm.user_id
      WHERE tm.team_id = ?
    `;
    const [rows] = await conn.query<RowDataPacket[]>(sql, [teamId]);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  } finally {
    conn.release();
  }
};

export const selectUserById = async (id: number) => {
  const conn = await connection.getConnection();
  try {
    const sql = 'SELECT id, name FROM users WHERE id = ?';
    const [rows] = await conn.query<RowDataPacket[]>(sql, [id]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const selectUserByUserId = async (userId: string) => {
  const conn = await connection.getConnection();
  try {
    const sql = 'SELECT id, name FROM users WHERE name = ?';
    const [rows] = await conn.query<RowDataPacket[]>(sql, [userId]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const insertTeamMember = async (
  teamId: number,
  userId: number
): Promise<void> => {
  const conn = await connection.getConnection();
  const sql = 'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)';
  await conn.query(sql, [teamId, userId]);
};

export const deleteTeamMemberByUserId = async (
  teamId: number,
  userId: number
): Promise<void> => {
  const conn = await connection.getConnection();
  try {
    const sql = 'DELETE FROM team_members WHERE team_id = ? AND user_id = ?';
    await conn.query(sql, [teamId, userId]);
  } finally {
    conn.release();
  }
};
