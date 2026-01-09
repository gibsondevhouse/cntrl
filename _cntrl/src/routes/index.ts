import { Router } from 'express';
import filesRouter from './files.routes.js';
import systemRouter from './system.routes.js';

const router = Router();

// Mount routes
router.use('/files', filesRouter);
router.use('/', systemRouter);

export default router;
