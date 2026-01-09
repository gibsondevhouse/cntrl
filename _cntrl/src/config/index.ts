import path from "path";
import dotenv from 'dotenv';

dotenv.config();

// We assume the process is started from the '_cntrl' directory
const CWD = process.cwd();

export const PROJECT_ROOT: string = path.resolve(CWD, "../"); // /Volumes/cntrl
export const DRIVE_ROOT: string = PROJECT_ROOT;
export const NOVEL_DIR: string = path.join(DRIVE_ROOT, 'novel');
export const CORTEX_PATH: string = path.join(CWD, 'cortex');

export const PERSONA = {
  name: "CNTRL",
  role: "The Muse",
  tone: "Editorial, Collaborative, Insightful",
  description: "I am CNTRL, your editorial partner. We craft narratives together.",
} as const;

export const CONFIG = {
    PORT: Number(process.env.PORT) || 3001,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY as string | undefined
} as const;
