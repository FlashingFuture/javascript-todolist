import type { Pool } from 'mysql2/promise';

declare global {
  namespace Express {
    interface Application {
      locals: {
        db: Pool;
      };
    }
  }
}
