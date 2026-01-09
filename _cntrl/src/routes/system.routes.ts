import { Router } from 'express';
import path from 'path';
import { PROJECT_ROOT, PERSONA } from '../config/index.js';

const router = Router();

router.get("/status", (req, res) => {
  res.json({
    status: "ONLINE",
    system: "CNTRL V2.0",
    drive_root: PROJECT_ROOT,
    persona: PERSONA,
  });
});

router.get("/manifest", (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, "MANIFEST.md"));
});

export default router;
