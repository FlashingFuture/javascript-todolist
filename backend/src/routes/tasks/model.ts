import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Pool } from 'mysql2/promise';

export const insertUserTask = async (
  db: Pool,
  payload: {
    userId: number;
    contents: string;
    duration: number;
  }
): Promise<{ id: number; contents: string }> => {
  const { userId, contents, duration } = payload;
  const conn = await db.getConnection();
  try {
    const sql = `
      INSERT INTO user_tasks (user_id, contents, due_date)
      VALUES (?, ?, NOW() + INTERVAL ? DAY)
    `;
    const [result] = await conn.query<ResultSetHeader>(sql, [
      userId,
      contents,
      duration,
    ]);
    return {
      id: result.insertId,
      contents,
    };
  } finally {
    conn.release();
  }
};

export const insertTeamTask = async (
  db: Pool,
  payload: {
    teamId: number;
    contents: string;
    duration: number;
  }
): Promise<{ teamId: number; id: number; contents: string }> => {
  const { teamId, contents, duration } = payload;
  const conn = await db.getConnection();
  try {
    const sql = `
      INSERT INTO team_tasks (team_id, contents, due_date)
      VALUES (?, ?, NOW() + INTERVAL ? DAY)
    `;
    const [result] = await conn.query<ResultSetHeader>(sql, [
      teamId,
      contents,
      duration,
    ]);
    return {
      teamId,
      id: result.insertId,
      contents,
    };
  } finally {
    conn.release();
  }
};

export const selectUserTasks = async (
  db: Pool,
  userId: number
): Promise<RowDataPacket[]> => {
  const conn = await db.getConnection();
  try {
    const sql = `
      SELECT id AS taskId, contents, due_date, is_done as isDone
      FROM user_tasks
      WHERE user_id = ?
      ORDER BY due_date ASC
    `;
    const [rows] = await conn.query<RowDataPacket[]>(sql, [userId]);
    return rows;
  } finally {
    conn.release();
  }
};

export const selectTeamTasks = async (
  db: Pool,
  teamId: number
): Promise<RowDataPacket[]> => {
  const conn = await db.getConnection();
  try {
    const sql = `
      SELECT id AS taskId, contents, due_date, is_done as isDone
      FROM team_tasks
      WHERE team_id = ?
      ORDER BY due_date ASC
    `;
    const [rows] = await conn.query<RowDataPacket[]>(sql, [teamId]);
    return rows;
  } finally {
    conn.release();
  }
};

export const updateUserTask = async (
  db: Pool,
  payload: {
    taskId: number;
    contents: string;
    duration: number;
    userId: number;
  }
): Promise<RowDataPacket | null> => {
  const { taskId, contents, duration, userId } = payload;

  const updateSql = `
    UPDATE user_tasks
    SET contents = ?, due_date = NOW() + INTERVAL ? DAY
    WHERE id = ? AND user_id = ?
  `;

  const selectSql = `
    SELECT id AS taskId, contents, due_date AS dueDate, is_done as isDone
    FROM user_tasks
    WHERE id = ? AND user_id = ?
  `;

  const conn = await db.getConnection();
  try {
    await conn.query(updateSql, [contents, duration, taskId, userId]);
    const [rows] = await conn.query<RowDataPacket[]>(selectSql, [
      taskId,
      userId,
    ]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const updateTeamTask = async (
  db: Pool,
  payload: {
    taskId: number;
    contents: string;
    duration: number;
    teamId: number;
  }
): Promise<RowDataPacket | null> => {
  const { taskId, contents, duration, teamId } = payload;

  const updateSql = `
    UPDATE team_tasks
    SET contents = ?, due_date = NOW() + INTERVAL ? DAY
    WHERE id = ? AND team_id = ?
  `;

  const selectSql = `
    SELECT id AS taskId, contents, due_date AS dueDate, is_done as isDone
    FROM team_tasks
    WHERE id = ? AND team_id = ?
  `;

  const conn = await db.getConnection();
  try {
    await conn.query(updateSql, [contents, duration, taskId, teamId]);
    const [rows] = await conn.query<RowDataPacket[]>(selectSql, [
      taskId,
      teamId,
    ]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const deleteUserTask = async (
  db: Pool,
  taskId: number,
  userId: number
): Promise<boolean> => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `DELETE FROM user_tasks WHERE id = ? AND user_id = ?`,
      [taskId, userId]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
};

export const deleteTeamTask = async (
  db: Pool,
  taskId: number,
  teamId: number
): Promise<boolean> => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `DELETE FROM team_tasks WHERE id = ? AND team_id = ?`,
      [taskId, teamId]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
};

export const completeUserTask = async (
  db: Pool,
  taskId: number,
  userId: number
): Promise<RowDataPacket | null> => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT contents FROM user_tasks WHERE id = ? AND user_id = ?`,
      [taskId, userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) return null;

    await conn.query(
      `UPDATE user_tasks SET is_done = 1 WHERE id = ? AND user_id = ?`,
      [taskId, userId]
    );

    return rows[0];
  } finally {
    conn.release();
  }
};

export const completeTeamTask = async (
  db: Pool,
  taskId: number,
  teamId: number
): Promise<RowDataPacket | null> => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT contents FROM team_tasks WHERE id = ? AND team_id = ?`,
      [taskId, teamId]
    );

    if (!Array.isArray(rows) || rows.length === 0) return null;

    await conn.query(
      `UPDATE team_tasks SET is_done = 1 WHERE id = ? AND team_id = ?`,
      [taskId, teamId]
    );

    return rows[0];
  } finally {
    conn.release();
  }
};
