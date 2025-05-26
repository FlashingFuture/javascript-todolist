import { testConnection } from '@/database/testDB';

export const initTestDB = async () => {
  const conn = await testConnection.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        owner_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id)
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        team_id INT NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams(id)
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS team_tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contents VARCHAR(255) NOT NULL,
        team_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        due_date DATETIME DEFAULT NULL,
        is_done TINYINT DEFAULT 0,
        FOREIGN KEY (team_id) REFERENCES teams(id)
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contents VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        due_date DATETIME DEFAULT NULL,
        is_done TINYINT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  } catch (err) {
    console.error('DB 초기화 중 에러 발생:', err);
  } finally {
    conn.release();
  }
};
