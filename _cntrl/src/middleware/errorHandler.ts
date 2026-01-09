import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Log the error
    logger.error(`[${req.method}] ${req.url} - ${err.message}`, { 
        stack: err.stack,
        ip: req.ip 
    });

    // Handle Zod Validation Errors
    if (err instanceof ZodError) {
        res.status(400).json({
            error: "VALIDATION_ERROR",
            details: err.issues
        });
        return;
    }

    // Handle Custom App Errors (if we had a specific class, for now generic)
    if (err.message.includes("Access Denied")) {
        res.status(403).json({ error: "ACCESS_DENIED", message: err.message });
        return;
    }

    if (err.message.includes("ENOENT") || err.message.includes("not found")) {
        res.status(404).json({ error: "NOT_FOUND", message: "Resource not found" });
        return;
    }

    // Default 500
    res.status(500).json({
        error: "INTERNAL_ERROR",
        message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
    });
};
