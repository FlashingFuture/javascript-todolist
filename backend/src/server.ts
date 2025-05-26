import app from './app';
import { connection } from './database/mariadb';

const PORT = process.env.PORT || 3000;

app.locals.db = connection;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
