import 'module-alias/register';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { errorHandler } from './middlewares/errorHandler';
import userRouter from './routes/users';

const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use(errorHandler);

export default app;
