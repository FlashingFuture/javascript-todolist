import { initTestDB } from '@/tests/setup/initTestDB';
import { resetTestDB } from '@/tests/setup/resetTestDB';
import { testConnection } from '@/database/testDB';

beforeAll(async () => {
  await initTestDB();
});

beforeEach(async () => {
  await resetTestDB();
});

afterAll(async () => {
  await testConnection.end();
});
