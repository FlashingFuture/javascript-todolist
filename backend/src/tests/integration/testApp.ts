import app from '@/app';
import { testConnection } from '@/database/testDB';

app.locals.db = testConnection;

export default app;
