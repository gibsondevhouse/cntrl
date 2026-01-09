import { Router } from 'express';
import * as FileSystemController from '../controllers/FileSystemController.js';

const router = Router();

router.get('/list', FileSystemController.listFiles);
router.post('/read', FileSystemController.readFile);
router.post('/write', FileSystemController.writeFile);

export default router;
