import express from 'express';
import * as users from './controller';
import { registerValidator } from './validator';

const router = express.Router();

router.post('/register', ...registerValidator, users.registerUser);

export default router;
