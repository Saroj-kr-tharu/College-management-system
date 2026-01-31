import express from 'express';
import { getDashboard } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { onlyAdmin } from '../types/global.types';

const router = express.Router();

router.get('/', authenticate(onlyAdmin), getDashboard);

export default router;
