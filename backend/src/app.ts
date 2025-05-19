import 'module-alias/register';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/users';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use(errorHandler);

export default app;
