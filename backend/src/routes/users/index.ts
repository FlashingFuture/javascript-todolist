import express from 'express';
import * as users from './controller';
import { loginValidator, registerValidator } from './validator';

const router = express.Router();

router.post('/register', ...registerValidator, users.registerUser);
router.post('/login', ...loginValidator, users.loginUser);

export default router;
