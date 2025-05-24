import 'module-alias/register';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { errorHandler } from './middlewares/errorHandler';
import userRouter from './routes/users';
import teamRouter from './routes/teams';
import taskRouter from './routes/tasks';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/teams', teamRouter);
app.use('/api/tasks', taskRouter);
app.use(errorHandler);

export default app;
